import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { format } from 'date-fns';
import axios from 'axios';

const WorkoutDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const response = await axios.get(`/api/workouts/${id}/`);
        setWorkout(response.data);
      } catch (err) {
        setError('Failed to load workout details');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await axios.delete(`/api/workouts/${id}/`);
        navigate('/workouts');
      } catch (err) {
        setError('Failed to delete workout');
      }
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!workout) {
    return <Alert variant="info">Workout not found</Alert>;
  }

  return (
    <div className="container py-4">
      <Card className="mx-auto" style={{ maxWidth: '700px' }}>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h1 className="h3 mb-1 text-capitalize">
                {workout.workout_type} Workout
              </h1>
              <p className="text-muted">
                {format(new Date(workout.date_logged), 'PPP')}
              </p>
            </div>
            <div>
              <Button
                variant="outline-primary"
                className="me-2"
                onClick={() => navigate(`/workouts/${id}/edit`)}
              >
                Edit
              </Button>
              <Button
                variant="outline-danger"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>

          <Row className="g-4 mb-4">
            <Col md={6}>
              <Card className="h-100">
                <Card.Body>
                  <h5>Duration</h5>
                  <p className="mb-0">{workout.duration} minutes</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100">
                <Card.Body>
                  <h5>Calories Burned</h5>
                  <p className="mb-0">{workout.calories} kcal</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100">
                <Card.Body>
                  <h5>Intensity</h5>
                  <p className="mb-0 text-capitalize">{workout.intensity}</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100">
                <Card.Body>
                  <h5>Time</h5>
                  <p className="mb-0">{format(new Date(workout.created_at), 'p')}</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {workout.notes && (
            <Card className="mb-4">
              <Card.Body>
                <h5>Notes</h5>
                <p className="mb-0">{workout.notes}</p>
              </Card.Body>
            </Card>
          )}

          <div className="d-flex justify-content-between mt-4">
            <Button
              variant="outline-secondary"
              onClick={() => navigate('/workouts')}
            >
              ← Back to Workouts
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/workouts/create')}
            >
              Log Another Workout
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default WorkoutDetail;