import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Alert, Button, Col, Container, Form, Image, Row } from 'react-bootstrap';
import { axiosReq } from '../../api/axiosDefaults';
import { useCurrentUser, useSetCurrentUser } from '../../contexts/CurrentUserContext';
import styles from '../../styles/ProfileEditForm.module.css';

const ProfileEditForm = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const { id } = useParams();
  const navigate = useNavigate();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Add owner check
    if (currentUser?.profile_id !== parseInt(id)) {
      navigate('/');
    }
  }, [currentUser, id, navigate]);

  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    weight: '',
    height: '',
    date_of_birth: '',
    gender: '',
    fitness_goals: '',
    profile_image: '',
  });

  const { 
    name, 
    bio, 
    weight, 
    height, 
    date_of_birth, 
    gender, 
    fitness_goals,
    profile_image 
  } = profileData;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axiosReq.get(`/profiles/${id}/`);
        const {
          name,
          bio,
          weight,
          height,
          date_of_birth,
          gender,
          fitness_goals,
          profile_image,
        } = data;

        setProfileData({
          name,
          bio,
          weight,
          height,
          date_of_birth: date_of_birth || '',
          gender: gender || '',
          fitness_goals,
          profile_image,
        });
        setHasLoaded(true);
      } catch (err) {
        console.error(err);
        navigate('/');
      }
    };
    fetchProfile();
  }, [id, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfileData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    Object.keys(profileData).forEach((key) => {
      if (profileData[key] !== "") {
        formData.append(key, profileData[key]);
      }
    });

    try {
      const { data } = await axiosReq.put(`/profiles/${id}/`, formData);
      setCurrentUser((currentUser) => ({
        ...currentUser,
        profile_image: data.profile_image,
      }));
      navigate(`/profiles/${id}`);
    } catch (err) {
      console.error(err);
      setErrors(err.response?.data || {});
    }
  };

  const textFields = (
    <>
      <Form.Group>
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.name?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Bio</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="bio"
          value={bio}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.bio?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Row>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Weight (kg)</Form.Label>
            <Form.Control
              type="number"
              name="weight"
              value={weight}
              onChange={handleChange}
            />
          </Form.Group>
          {errors?.weight?.map((message, idx) => (
            <Alert variant="warning" key={idx}>
              {message}
            </Alert>
          ))}
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Height (cm)</Form.Label>
            <Form.Control
              type="number"
              name="height"
              value={height}
              onChange={handleChange}
            />
          </Form.Group>
          {errors?.height?.map((message, idx) => (
            <Alert variant="warning" key={idx}>
              {message}
            </Alert>
          ))}
        </Col>
      </Row>

      <Form.Group>
        <Form.Label>Date of Birth</Form.Label>
        <Form.Control
          type="date"
          name="date_of_birth"
          value={date_of_birth}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.date_of_birth?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Gender</Form.Label>
        <Form.Select
          name="gender"
          value={gender}
          onChange={handleChange}
        >
          <option value="">Select gender</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
          <option value="O">Other</option>
        </Form.Select>
      </Form.Group>
      {errors?.gender?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Fitness Goals</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="fitness_goals"
          value={fitness_goals}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.fitness_goals?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Button
        className="mr-3"
        onClick={() => navigate(-1)}
      >
        Cancel
      </Button>
      <Button type="submit">
        Save
      </Button>
    </>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col className="py-2 p-0 p-md-2" md={7} lg={6}>
          <Container className={styles.Content}>
            {hasLoaded ? (
              <>
                <Form.Group className="text-center">
                  {profile_image && (
                    <figure>
                      <Image 
                        className={styles.ProfileImage} 
                        src={profile_image} 
                        alt="Profile Image"
                        rounded
                      />
                    </figure>
                  )}
                  <div>
                    <Form.Label
                      className={`${styles.UploadButton} btn`}
                      htmlFor="image-upload"
                    >
                      Change Profile Image
                    </Form.Label>
                  </div>

                  <Form.File
                    id="image-upload"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files.length) {
                        setProfileData({
                          ...profileData,
                          profile_image: e.target.files[0],
                        });
                      }
                    }}
                    className="d-none"
                  />
                </Form.Group>
                {errors?.profile_image?.map((message, idx) => (
                  <Alert variant="warning" key={idx}>
                    {message}
                  </Alert>
                ))}
                <div className="d-md-none">{textFields}</div>
              </>
            ) : (
              <div className="text-center">Loading...</div>
            )}
          </Container>
        </Col>
        <Col md={5} lg={6} className="d-none d-md-block p-0 p-md-2">
          <Container className={styles.Content}>{textFields}</Container>
        </Col>
      </Row>
    </Form>
  );
};

export default ProfileEditForm;