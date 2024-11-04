import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import { axiosReq } from '../../api/axiosDefaults';
import styles from '../../styles/WorkoutForm.module.css';

const WorkoutForm = () => {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [workoutData, setWorkoutData] = useState({
    workout_type: '',
    duration: '',
    calories: '',
    intensity: 'moderate',
    notes: '',
    date_logged: new Date().toISOString().split('T')[0],
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      const fetchWorkout = async () => {
        try {
          const { data } = await axiosReq.get(`/api/workouts/workouts/${id}/`);
          const { workout_type, duration, calories, intensity, notes, date_logged } = data;
          setWorkoutData({ workout_type, duration, calories, intensity, notes, date_logged });
        } catch (err) {
          console.error('Error fetching workout:', err);
          navigate('/workouts');
        }
      };
      fetchWorkout();
    }
  }, [id, navigate, isEditing]);

  const handleChange = (event) => {
    setWorkoutData({
      ...workoutData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData();

    Object.keys(workoutData).forEach(key => {
      formData.append(key, workoutData[key]);
    });

    try {
      if (isEditing) {
        await axiosReq.put(`/api/workouts/workouts/${id}/`, formData);
      } else {
        await axiosReq.post('/api/workouts/workouts/', formData);
      }
      navigate('/workouts');
    } catch (err) {
      console.error('Error submitting workout:', err);
      setErrors(err.response?.data || {});
    } finally {
      setIsLoading(false);
    }
  };

  const textFields = (
    <>
      <Form.Group>
        <Form.Label>Date</Form.Label>
        <Form.Control
          type="date"
          name="date_logged"
          value={workoutData.date_logged}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.date_logged?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Workout Type</Form.Label>
        <Form.Select
          name="workout_type"
          value={workoutData.workout_type}
          onChange={handleChange}
        >
          <option value="">Select type</option>
          <option value="cardio">Cardio</option>
          <option value="strength">Strength Training</option>
          <option value="flexibility">Flexibility</option>
          <option value="sports">Sports</option>
          <option value="other">Other</option>
        </Form.Select>
      </Form.Group>
      {errors?.workout_type?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Duration (minutes)</Form.Label>
        <Form.Control
          type="number"
          name="duration"
          value={workoutData.duration}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.duration?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Calories Burned</Form.Label>
        <Form.Control
          type="number"
          name="calories"
          value={workoutData.calories}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.calories?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Intensity</Form.Label>
        <Form.Select
          name="intensity"
          value={workoutData.intensity}
          onChange={handleChange}
        >
          <option value="low">Low</option>
          <option value="moderate">Moderate</option>
          <option value="high">High</option>
        </Form.Select>
      </Form.Group>
      {errors?.intensity?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Notes</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="notes"
          value={workoutData.notes}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.notes?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <div className="text-right">
        <Button
          onClick={() => navigate('/workouts')}
          variant="outline-secondary"
          className="mr-2"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Workout')}
        </Button>
      </div>
    </>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Container className={styles.Container}>
        <h2>{isEditing ? 'Edit Workout' : 'Create Workout'}</h2>
        {textFields}
      </Container>
    </Form>
  );
};

export default WorkoutForm;