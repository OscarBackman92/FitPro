import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { LineChart, XAxis, YAxis, CartesianGrid, Line, Tooltip } from 'recharts';
import { format } from 'date-fns';
import axios from 'axios';

const WorkoutList = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get('/api/workouts/');
        setWorkouts(response.data.results);
        
        // Process data for chart
        const chartData = response.data.results
          .slice(0, 7)
          .reverse()
          .map(workout => ({
            date: format(new Date(workout.date_logged), 'MMM d'),
            duration: workout.duration,
            calories: workout.calories
          }));
        setChartData(chartData);
        
      } catch (err) {
        setError('Failed to load workouts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  const handleDelete = async (workoutId) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await axios.delete(`/api/workouts/${workoutId}/`);
        setWorkouts(workouts.filter(w => w.id !== workoutId));
      } catch (err) {
        setError('Failed to delete workout');
      }
    }
  };

  const filteredWorkouts = workouts.filter(workout => {
    if (filter === 'all') return true;
    return workout.workout_type === filter;
  });

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">My Workouts</h1>
        <Button
          variant="primary"
          onClick={() => navigate('/workouts/create')}
        >
          Log New Workout
        </Button>
      </div>

      <Card className="mb-4">
        <Card.Body>
          <h4 className="mb-4">Recent Activity</h4>
          <div className="d-flex justify-content-center">
            <LineChart width={600} height={300} data={chartData}>
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Tooltip />
              <Line yAxisId="left" type="monotone" dataKey="duration" stroke="#8884d8" name="Duration (min)" />
              <Line yAxisId="right" type="monotone" dataKey="calories" stroke="#82ca9d" name="Calories" />
            </LineChart>
          </div>
        </Card.Body>
      </Card>

      <Form.Group className="mb-4">
        <Form.Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="cardio">Cardio</option>
          <option value="strength">Strength</option>
          <option value="flexibility">Flexibility</option>
          <option value="sports">Sports</option>
          <option value="other">Other</option>
        </Form.Select>
      </Form.Group>

      {filteredWorkouts.length === 0 ? (
        <Alert variant="info">No workouts found</Alert>
      ) : (
        <Row className="g-4">
          {filteredWorkouts.map(workout => (
            <Col key={workout.id} xs={12}>
              <Card>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="text-capitalize mb-1">
                        {workout.workout_type} - {workout.intensity} Intensity
                      </h5>
                      <p className="text-muted mb-2">
                        {format(new Date(workout.date_logged), 'PPP')}
                      </p>
                      <p className="mb-2">
                        Duration: {workout.duration} minutes | Calories: {workout.calories}
                      </p>
                      {workout.notes && (
                        <p className="mb-0 text-muted">{workout.notes}</p>
                      )}
                    </div>
                    <div>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => navigate(`/workouts/${workout.id}`)}
                      >
                        View
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(workout.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default WorkoutList;