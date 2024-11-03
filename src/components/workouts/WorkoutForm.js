import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import { axiosReq } from '../../api/axiosDefaults';

const WorkoutForm = ({ workout = null }) => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [workoutData, setWorkoutData] = useState({
    workout_type: workout?.workout_type || '',
    duration: workout?.duration || '',
    calories: workout?.calories || '',
    notes: workout?.notes || '',
    intensity: workout?.intensity || 'moderate',
    date_logged: workout?.date_logged || new Date().toISOString().split('T')[0]
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkoutData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Format the data
      const formData = {
        ...workoutData,
        duration: parseInt(workoutData.duration, 10),
        calories: parseInt(workoutData.calories, 10)
      };

      if (workout) {
        const { data } = await axiosReq.put(
          `/api/workouts/${workout.id}/`, 
          JSON.stringify(formData)
        );
        console.log('Workout updated:', data);
      } else {
        const { data } = await axiosReq.post(
          '/api/workouts/', 
          JSON.stringify(formData)
        );
        console.log('Workout created:', data);
      }
      navigate('/workouts');
    } catch (err) {
      console.log('Error submitting workout:', err);
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setErrors({ non_field_errors: ['There was a problem submitting your workout. Please try again.'] });
      }
    } finally {
      setLoading(false);
    }
  };

  const errorDisplay = (fieldName) => {
    return errors[fieldName]?.map((error, idx) => (
      <Alert variant="warning" key={idx}>
        {error}
      </Alert>
    ));
  };

  return (
    <Card className="mx-auto" style={{ maxWidth: '700px' }}>
      <Card.Header>
        <h4 className="mb-0">
          {workout ? 'Edit Workout' : 'Log New Workout'}
        </h4>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date_logged"
              value={workoutData.date_logged}
              onChange={handleChange}
              required
            />
            {errorDisplay('date_logged')}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Workout Type</Form.Label>
            <Form.Select
              name="workout_type"
              value={workoutData.workout_type}
              onChange={handleChange}
              required
            >
              <option value="">Select type</option>
              <option value="cardio">Cardio</option>
              <option value="strength">Strength Training</option>
              <option value="flexibility">Flexibility</option>
              <option value="sports">Sports</option>
              <option value="other">Other</option>
            </Form.Select>
            {errorDisplay('workout_type')}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Duration (minutes)</Form.Label>
            <Form.Control
              type="number"
              name="duration"
              value={workoutData.duration}
              onChange={handleChange}
              min="1"
              max="1440"
              required
            />
            {errorDisplay('duration')}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Calories Burned</Form.Label>
            <Form.Control
              type="number"
              name="calories"
              value={workoutData.calories}
              onChange={handleChange}
              min="0"
              required
            />
            {errorDisplay('calories')}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Intensity</Form.Label>
            <Form.Select
              name="intensity"
              value={workoutData.intensity}
              onChange={handleChange}
              required
            >
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </Form.Select>
            {errorDisplay('intensity')}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              name="notes"
              value={workoutData.notes}
              onChange={handleChange}
              rows={4}
            />
            {errorDisplay('notes')}
          </Form.Group>

          {errorDisplay('non_field_errors')}

          <div className="d-flex gap-2 justify-content-end">
            <Button
              variant="outline-secondary"
              onClick={() => navigate('/workouts')}
              disabled={loading}
              type="button"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Saving...
                </>
              ) : (
                workout ? 'Update Workout' : 'Log Workout'
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default WorkoutForm;