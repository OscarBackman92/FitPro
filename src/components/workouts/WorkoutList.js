import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { axiosReq } from '../../api/axiosDefaults';
import Asset from '../../components/Asset';
import styles from '../../styles/WorkoutList.module.css';
import appStyles from '../../App.module.css';
import Container from 'react-bootstrap/Container';
import { Alert } from 'react-bootstrap';

const WorkoutList = ({ filter = "" }) => {
  const [workouts, setWorkouts] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [workoutType, setWorkoutType] = useState('all');
  const [sortOrder, setSortOrder] = useState('-date_logged');
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const { data } = await axiosReq.get(
          `/api/workouts/workouts/?${filter}ordering=${sortOrder}`
        );
        setWorkouts(data);
        setError(null);
      } catch (err) {
        setError('Failed to load workouts');
        console.error(err);
      } finally {
        setHasLoaded(true);
      }
    };

    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchWorkouts();
    }, 300);

    return () => clearTimeout(timer);
  }, [filter, sortOrder]);

  const handleDelete = async (workoutId) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await axiosReq.delete(`/api/workouts/workouts/${workoutId}/`);
        setWorkouts(prevWorkouts => ({
          ...prevWorkouts,
          results: prevWorkouts.results.filter(workout => workout.id !== workoutId)
        }));
      } catch (err) {
        setError('Failed to delete workout');
      }
    }
  };

  if (error) {
    return (
      <Container className={appStyles.Content}>
        <Alert variant="warning">{error}</Alert>
      </Container>
    );
  }

  if (!hasLoaded) {
    return (
      <Container className={appStyles.Content}>
        <Asset spinner />
      </Container>
    );
  }

  // Calculate summary stats
  const totalWorkouts = workouts.results.length;
  const totalDuration = workouts.results.reduce((sum, w) => sum + w.duration, 0);
  const totalCalories = workouts.results.reduce((sum, w) => sum + w.calories, 0);
  const avgDuration = Math.round(totalDuration / totalWorkouts) || 0;

  // Prepare chart data
  const chartData = workouts.results
    .slice(0, 7)
    .map(workout => ({
      date: new Date(workout.date_logged).toLocaleDateString(),
      duration: workout.duration,
      calories: workout.calories
    }))
    .reverse();

  return (
    <Container className={`${appStyles.Content} ${styles.WorkoutList}`}>
      {/* Header */}
      <div className={styles.HeaderContainer}>
        <h2 className={styles.Title}>{filter ? 'Activity Feed' : 'Workouts'}</h2>
        <button
          onClick={() => navigate('/workouts/create')}
          className={styles.CreateButton}
        >
          <i className="fas fa-plus"></i> Log Workout
        </button>
      </div>

      {/* Stats Summary */}
      <div className={styles.StatsGrid}>
        <div className={styles.StatCard}>
          <div className={styles.StatContent}>
            <div>
              <h3>Total Workouts</h3>
              <p>{totalWorkouts}</p>
            </div>
            <i className="fas fa-dumbbell"></i>
          </div>
        </div>

        <div className={styles.StatCard}>
          <div className={styles.StatContent}>
            <div>
              <h3>Total Duration</h3>
              <p>{totalDuration} mins</p>
            </div>
            <i className="fas fa-clock"></i>
          </div>
        </div>

        <div className={styles.StatCard}>
          <div className={styles.StatContent}>
            <div>
              <h3>Average Duration</h3>
              <p>{avgDuration} mins</p>
            </div>
            <i className="fas fa-chart-line"></i>
          </div>
        </div>

        <div className={styles.StatCard}>
          <div className={styles.StatContent}>
            <div>
              <h3>Total Calories</h3>
              <p>{totalCalories}</p>
            </div>
            <i className="fas fa-fire"></i>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className={styles.ChartContainer}>
        <h3>Activity Overview</h3>
        <div className={styles.Chart}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
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
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.FiltersContainer}>
        <div className={styles.FilterGroup}>
          <label>Workout Type</label>
          <select
            value={workoutType}
            onChange={(e) => setWorkoutType(e.target.value)}
            className={styles.Select}
          >
            <option value="all">All Types</option>
            <option value="cardio">Cardio</option>
            <option value="strength">Strength</option>
            <option value="flexibility">Flexibility</option>
            <option value="sports">Sports</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className={styles.FilterGroup}>
          <label>Sort By</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className={styles.Select}
          >
            <option value="-date_logged">Newest First</option>
            <option value="date_logged">Oldest First</option>
            <option value="-duration">Duration (High to Low)</option>
            <option value="duration">Duration (Low to High)</option>
            <option value="-calories">Calories (High to Low)</option>
            <option value="calories">Calories (Low to High)</option>
          </select>
        </div>
      </div>

      {/* Workout Table */}
      <div className={styles.TableContainer}>
        <div className={styles.TableHeader}>
          <h3>Workout History</h3>
          <button
            onClick={() => setIsTableExpanded(!isTableExpanded)}
            className={styles.ExpandButton}
          >
            <i className={`fas fa-chevron-${isTableExpanded ? 'up' : 'down'}`}></i>
          </button>
        </div>

        <div className={`${styles.TableWrapper} ${isTableExpanded ? styles.Expanded : ''}`}>
          <table className={styles.Table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Duration</th>
                <th>Calories</th>
                <th>Intensity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {workouts.results
                .filter(workout => workoutType === 'all' || workout.workout_type === workoutType)
                .map((workout) => (
                  <tr key={workout.id}>
                    <td>{new Date(workout.date_logged).toLocaleDateString()}</td>
                    <td className="text-capitalize">{workout.workout_type}</td>
                    <td>{workout.duration} mins</td>
                    <td>{workout.calories}</td>
                    <td>
                      <span className={`${styles.Badge} ${styles[workout.intensity]}`}>
                        {workout.intensity}
                      </span>
                    </td>
                    <td className={styles.Actions}>
                      <button
                        onClick={() => navigate(`/workouts/${workout.id}/edit`)}
                        className={styles.EditButton}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(workout.id)}
                        className={styles.DeleteButton}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </Container>
  );
};

export default WorkoutList;