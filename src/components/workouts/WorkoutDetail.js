import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Alert, Container } from 'react-bootstrap';
import { format } from 'date-fns';
import { axiosReq } from '../../api/axiosDefaults';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import Asset from '../../components/Asset';
import Avatar from '../../components/Avatar';
import styles from '../../styles/WorkoutDetail.module.css';

const WorkoutDetail = () => {
  const { id } = useParams();
  const [workout, setWorkout] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState(null);
  const currentUser = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const { data } = await axiosReq.get(`/api/workouts/workouts/${id}/`);
        setWorkout(data);
        setError(null);
      } catch (err) {
        setError('Failed to load workout details');
        console.error(err);
      } finally {
        setHasLoaded(true);
      }
    };

    setHasLoaded(false);
    fetchWorkout();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await axiosReq.delete(`/api/workouts/workouts/${id}/`);
        navigate('/workouts');
      } catch (err) {
        setError('Failed to delete workout');
      }
    }
  };

  if (!hasLoaded) return <Asset spinner />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!workout) return <Alert variant="warning">Workout not found</Alert>;

  const isOwner = currentUser?.profile_id === workout.profile_id;

  return (
    <Container className={styles.WorkoutDetail}>
      <Card className="shadow-sm">
        <Card.Header className="bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <Avatar
                src={workout.profile_image}
                height={40}
                className="me-2"
              />
              <div>
                <h5 className="mb-0">{workout.owner}</h5>
                <small className="text-muted">
                  {format(new Date(workout.created_at), 'PPp')}
                </small>
              </div>
            </div>
            {isOwner && (
              <div>
                <Button
                  variant="outline-primary"
                  className="me-2"
                  onClick={() => navigate(`/workouts/${id}/edit`)}
                >
                  <i className="fas fa-edit me-1"></i>
                  Edit
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={handleDelete}
                >
                  <i className="fas fa-trash-alt me-1"></i>
                  Delete
                </Button>
              </div>
            )}
          </div>
        </Card.Header>

        <Card.Body>
          <Row className="mb-4">
            <Col md={6}>
              <Card className="h-100">
                <Card.Body>
                  <h5 className="card-title">Workout Details</h5>
                  <dl className="row mb-0">
                    <dt className="col-sm-4">Type</dt>
                    <dd className="col-sm-8 text-capitalize">{workout.workout_type}</dd>

                    <dt className="col-sm-4">Date</dt>
                    <dd className="col-sm-8">
                      {format(new Date(workout.date_logged), 'PPP')}
                    </dd>

                    <dt className="col-sm-4">Time</dt>
                    <dd className="col-sm-8">
                      {format(new Date(workout.created_at), 'p')}
                    </dd>

                    <dt className="col-sm-4">Intensity</dt>
                    <dd className="col-sm-8 text-capitalize">
                      <span className={`badge bg-${workout.intensity === 'high' ? 'danger' : workout.intensity === 'moderate' ? 'warning' : 'success'}`}>
                        {workout.intensity}
                      </span>
                    </dd>
                  </dl>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="h-100">
                <Card.Body>
                  <h5 className="card-title">Workout Metrics</h5>
                  <Row className="text-center">
                    <Col xs={6}>
                      <div className={styles.MetricCard}>
                        <div className={styles.MetricIcon}>
                          <i className="fas fa-clock"></i>
                        </div>
                        <h3>{workout.duration}</h3>
                        <p className="mb-0">Minutes</p>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className={styles.MetricCard}>
                        <div className={styles.MetricIcon}>
                          <i className="fas fa-fire"></i>
                        </div>
                        <h3>{workout.calories}</h3>
                        <p className="mb-0">Calories</p>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {workout.notes && (
            <Card className="mb-4">
              <Card.Body>
                <h5 className="card-title">Notes</h5>
                <p className="mb-0">{workout.notes}</p>
              </Card.Body>
            </Card>
          )}

          <div className="d-flex justify-content-between mt-4">
            <Button
              variant="outline-secondary"
              onClick={() => navigate('/workouts')}
            >
              <i className="fas fa-arrow-left me-1"></i>
              Back to Workouts
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/workouts/create')}
            >
              <i className="fas fa-plus me-1"></i>
              Log Another Workout
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default WorkoutDetail;