import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Row, Col, Container, Alert } from 'react-bootstrap';
import { LineChart, XAxis, YAxis, CartesianGrid, Line, Tooltip } from 'recharts';
import { format } from 'date-fns';
import { axiosReq } from '../../api/axiosDefaults';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import Asset from '../../components/Asset';
import Avatar from '../../components/Avatar';
import { ProfileEditDropdown } from '../../components/MoreDropdown';
import styles from '../../styles/ProfilePage.module.css';

const ProfilePage = () => {
  const { id } = useParams();
  console.log("Profile ID from URL:", id);
  const currentUser = useCurrentUser();
  const [profile, setProfile] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [workouts, setWorkouts] = useState({ results: [] });

  const is_owner = currentUser?.profile_id === parseInt(id, 10);

  useEffect(() => {
    if (!id || isNaN(parseInt(id, 10))) {
      setError('Invalid profile ID');
      setHasLoaded(true);
      return;
    }

    const fetchProfileData = async () => {
      try {
        const [{ data: profileData }, { data: statsData }, { data: workoutsData }] = await Promise.all([
          axiosReq.get(`/profiles/${id}/`),
          axiosReq.get(`/profiles/${id}/stats/`),
          axiosReq.get(`/workouts/workouts/?user=${id}`)
        ]);
        setProfile(profileData);
        setStats(statsData);
        setWorkouts(workoutsData);
        setError(null);
      } catch (err) {
        console.error('[ProfilePage] Error fetching profile data:', err);
        setError('Failed to load profile data');
      } finally {
        setHasLoaded(true);
      }
    };

    setHasLoaded(false);
    fetchProfileData();
  }, [id]);

  const chartData = workouts.results
    .slice(0, 7)
    .map(workout => ({
      date: format(new Date(workout.date_logged), 'MMM d'),
      duration: workout.duration,
      calories: workout.calories,
    }))
    .reverse();

  if (!hasLoaded) return <Asset spinner />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className={styles.ProfilePage}>
      <Row>
        <Col lg={12}>
          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <Avatar
                    src={profile?.image}
                    height={80}
                    className="me-3"
                  />
                  <div>
                    <h2>{profile?.name || profile?.username}</h2>
                    {profile?.bio && <p className="mb-0">{profile.bio}</p>}
                  </div>
                </div>
                {is_owner && <ProfileEditDropdown id={id} />}
              </div>
              
              <Row className="mt-4 text-center">
                <Col xs={4}>
                  <div className={styles.Stat}>
                    <h3>{stats?.total_workouts || 0}</h3>
                    <p>Workouts</p>
                  </div>
                </Col>
                <Col xs={4}>
                  <div className={styles.Stat}>
                    <h3>{stats?.total_duration ? Math.round(stats.total_duration / 60) : 0}</h3>
                    <p>Hours</p>
                  </div>
                </Col>
                <Col xs={4}>
                  <div className={styles.Stat}>
                    <h3>{stats?.total_calories || 0}</h3>
                    <p>Calories</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Body>
              <h4>Activity Overview</h4>
              <div className="d-flex justify-content-center">
                <LineChart width={600} height={300} data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="duration"
                    stroke="#8884d8"
                    name="Duration (min)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="calories"
                    stroke="#82ca9d"
                    name="Calories"
                  />
                </LineChart>
              </div>
            </Card.Body>
          </Card>

          <h4>Recent Workouts</h4>
          {workouts.results.length > 0 ? (
            workouts.results.map(workout => (
              <Card key={workout.id} className="mb-3">
                <Card.Body>
                  <Row>
                    <Col xs={12} md={4}>
                      <h5 className="text-capitalize">{workout.workout_type}</h5>
                      <p className="text-muted">
                        {format(new Date(workout.date_logged), 'PPP')}
                      </p>
                    </Col>
                    <Col xs={12} md={4}>
                      <p>Duration: {workout.duration} minutes</p>
                      <p>Calories: {workout.calories}</p>
                    </Col>
                    <Col xs={12} md={4} className="text-md-end">
                      <p className="mb-0">Intensity: {workout.intensity}</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))
          ) : (
            <Card className="text-center p-4">
              <Card.Body>
                <p className="mb-0">No workouts recorded yet.</p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
