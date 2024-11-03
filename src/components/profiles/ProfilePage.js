import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Image } from 'react-bootstrap';
import { axiosReq } from '../../api/axiosDefaults';
import { useCurrentUser } from '../../context/CurrentUserContext';
import styles from '../../styles/ProfilePage.module.css';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const [profileData, setProfileData] = useState({
    user: null,
    workouts: [],
    stats: {
      total_workouts: 0,
      total_duration: 0,
      total_calories: 0,
      favorite_type: '',
      this_month: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isOwner = currentUser?.profile_id === parseInt(id);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        let profileResponse;
        
        if (!id || currentUser?.profile_id === parseInt(id)) {
          profileResponse = await axiosReq.get('/api/profiles/me/');
          navigate(`/profiles/${currentUser.profile_id}`);
        } else {
          profileResponse = await axiosReq.get(`/api/profiles/me/`);
        }

        const workoutsResponse = await axiosReq.get('/api/workouts/', {
          params: {
            user: profileResponse.data.id
          }
        });

        const workouts = workoutsResponse.data.results;
        const stats = calculateStats(workouts);

        setProfileData({
          user: profileResponse.data,
          workouts,
          stats
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.response?.data?.message || 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id, currentUser, navigate]);

  const calculateStats = (workouts) => {
    const now = new Date();
    const thisMonth = workouts.filter(w => {
      const workoutDate = new Date(w.date_logged);
      return workoutDate.getMonth() === now.getMonth() &&
             workoutDate.getFullYear() === now.getFullYear();
    });

    const typeCount = workouts.reduce((acc, workout) => {
      acc[workout.workout_type] = (acc[workout.workout_type] || 0) + 1;
      return acc;
    }, {});

    return {
      total_workouts: workouts.length,
      total_duration: workouts.reduce((sum, w) => sum + w.duration, 0),
      total_calories: workouts.reduce((sum, w) => sum + w.calories, 0),
      favorite_type: Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None',
      this_month: thisMonth.length
    };
  };

  if (loading) return <div className="text-center p-4">Loading profile...</div>;
  if (error) return <div className="text-center p-4 text-danger">{error}</div>;

  const { user, workouts } = profileData;

  return (
    <div className="container py-4">
      <Row className="mb-4">
        <Col md={4}>
          <Card>
            <Card.Body className="text-center">
              <Image 
                src={user?.profile_image || '/default-avatar.png'} 
                roundedCircle 
                className={styles.ProfileImage}
              />
              <h3 className="mt-3">{user?.username}</h3>
              {isOwner && (
                <Button 
                  variant="outline-primary" 
                  onClick={() => navigate(`/profiles/${id}/edit`)}
                  className="mt-2"
                >
                  Edit Profile
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card>
            <Card.Header>
              <h4>Fitness Overview</h4>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col sm={6} md={4} className="text-center mb-3">
                  <h5>Total Workouts</h5>
                  <p className="h2">{profileData.stats.total_workouts}</p>
                </Col>
                <Col sm={6} md={4} className="text-center mb-3">
                  <h5>This Month</h5>
                  <p className="h2">{profileData.stats.this_month}</p>
                </Col>
                <Col sm={6} md={4} className="text-center mb-3">
                  <h5>Total Hours</h5>
                  <p className="h2">{Math.round(profileData.stats.total_duration / 60)}</p>
                </Col>
                <Col sm={6} md={4} className="text-center">
                  <h5>Total Calories</h5>
                  <p className="h2">{profileData.stats.total_calories}</p>
                </Col>
                <Col sm={6} md={4} className="text-center">
                  <h5>Favorite Type</h5>
                  <p className="h2 text-capitalize">{profileData.stats.favorite_type}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <h4>Recent Workouts</h4>
        </Card.Header>
        <Card.Body>
          {workouts.slice(0, 5).map(workout => (
            <div key={workout.id} className="border-bottom mb-3 pb-3">
              <h5 className="text-capitalize">{workout.workout_type}</h5>
              <Row>
                <Col>
                  <small className="text-muted">
                    {new Date(workout.date_logged).toLocaleDateString()}
                  </small>
                </Col>
                <Col>
                  <small>Duration: {workout.duration} mins</small>
                </Col>
                <Col>
                  <small>Calories: {workout.calories}</small>
                </Col>
                <Col>
                  <small className="text-capitalize">
                    Intensity: {workout.intensity}
                  </small>
                </Col>
              </Row>
            </div>
          ))}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProfilePage;