import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Row, Col, Container } from 'react-bootstrap';
import { axiosReq } from '../../api/axiosDefaults';
import { useCurrentUser } from '../../context/CurrentUserContext';
import Avatar from '../../components/Avatar';
import Asset from '../../components/Asset';
import { LineChart, XAxis, YAxis, CartesianGrid, Line, Tooltip } from 'recharts';
import { ProfileEditDropdown } from '../../components/MoreDropdown';
import styles from '../../styles/ProfilePage.module.css';

const ProfilePage = () => {
  const { id } = useParams();
  const currentUser = useCurrentUser();
  const [profile, setProfile] = useState(null);
  const [workouts, setWorkouts] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState("");

  // Check if current user is profile owner
  const is_owner = currentUser?.id === parseInt(id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching profile data for ID:", id);
        const [{ data: profileData }, { data: workoutsData }] = await Promise.all([
          axiosReq.get(`/api/profiles/${id}/`),
          axiosReq.get(`/api/workouts/?user=${id}`)
        ]);
        console.log("Profile data received:", profileData);
        console.log("Workouts data received:", workoutsData);
        setProfile(profileData);
        setWorkouts(workoutsData);
        setHasLoaded(true);
      } catch (err) {
        console.log("Error fetching profile data:", err);
        setError("Failed to load profile data. Please try again later.");
      }
    };
    fetchData();
  }, [id]);

  const mainProfile = (
    <>
      {is_owner && <ProfileEditDropdown id={id} />}
      <Row className="px-3 text-center">
        <Col lg={3} className="text-lg-left">
          <Avatar 
            src={profile?.profile_image || "/default-avatar.png"}
            height={40}
            text={profile?.username}
          />
        </Col>
        <Col lg={6}>
          <h3 className="m-2">{profile?.username}</h3>
          <Row className="justify-content-center">
            <Col xs={3} className="my-2">
              <div>{workouts.results.length}</div>
              <div>workouts</div>
            </Col>
            {profile?.name && (
              <Col xs={3} className="my-2">
                <div>Name</div>
                <div>{profile.name}</div>
              </Col>
            )}
            {profile?.email && (
              <Col xs={3} className="my-2">
                <div>Email</div>
                <div>{profile.email}</div>
              </Col>
            )}
          </Row>
        </Col>
      </Row>
    </>
  );

  const chartData = workouts.results
    .slice(0, 7)
    .map(workout => ({
      date: new Date(workout.created_at).toLocaleDateString(),
      duration: workout.duration,
      calories: workout.calories
    }))
    .reverse();

  if (error) {
    return (
      <Container>
        <Asset message={error} />
      </Container>
    );
  }

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <Container className={`${styles.Content} bg-white rounded`}>
          {hasLoaded ? (
            <>
              {mainProfile}
              <Card className="mt-4">
                <Card.Header>
                  <h4>Recent Activity</h4>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex justify-content-center">
                    {chartData.length > 0 ? (
                      <LineChart width={600} height={300} data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis 
                          yAxisId="left" 
                          orientation="left" 
                          stroke="#8884d8"
                          label={{ value: 'Duration (min)', angle: -90, position: 'insideLeft' }}
                        />
                        <YAxis 
                          yAxisId="right" 
                          orientation="right" 
                          stroke="#82ca9d"
                          label={{ value: 'Calories', angle: 90, position: 'insideRight' }}
                        />
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
                    ) : (
                      <p>No workout data available</p>
                    )}
                  </div>
                </Card.Body>
              </Card>

              <Card className="mt-4">
                <Card.Header>
                  <h4>Recent Workouts</h4>
                </Card.Header>
                <Card.Body>
                  {workouts.results.length ? (
                    workouts.results.slice(0, 5).map(workout => (
                      <div key={workout.id} className="border-bottom mb-3 pb-3">
                        <h5 className="text-capitalize">{workout.workout_type}</h5>
                        <Row>
                          <Col xs={12} sm={6} md={3}>
                            <small className="text-muted">
                              {new Date(workout.created_at).toLocaleDateString()}
                            </small>
                          </Col>
                          <Col xs={12} sm={6} md={3}>
                            <small>Duration: {workout.duration} mins</small>
                          </Col>
                          <Col xs={12} sm={6} md={3}>
                            <small>Calories: {workout.calories}</small>
                          </Col>
                          <Col xs={12} sm={6} md={3}>
                            <small className="text-capitalize">
                              Intensity: {workout.intensity}
                            </small>
                          </Col>
                        </Row>
                      </div>
                    ))
                  ) : (
                    <p>No workouts recorded yet</p>
                  )}
                </Card.Body>
              </Card>
            </>
          ) : (
            <Asset spinner />
          )}
        </Container>
      </Col>
    </Row>
  );
};

export default ProfilePage;