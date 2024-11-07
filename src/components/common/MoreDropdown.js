import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/MoreDropdown.module.css';

const ThreeDots = React.forwardRef(({ onClick }, ref) => (
  <i
    className="fas fa-ellipsis-v"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  />
));

ThreeDots.displayName = "ThreeDots";

export const MoreDropdown = ({ handleEdit, handleDelete }) => (
  <Dropdown className="ml-auto" drop="left">
    <Dropdown.Toggle as={ThreeDots} />
    <Dropdown.Menu className="text-center">
      <Dropdown.Item
        className={styles.DropdownItem}
        onClick={handleEdit}
        aria-label="edit"
      >
        <i className="fas fa-edit" /> Edit
      </Dropdown.Item>
      <Dropdown.Item
        className={styles.DropdownItem}
        onClick={handleDelete}
        aria-label="delete"
      >
        <i className="fas fa-trash-alt" /> Delete
      </Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
);

export const ProfileEditDropdown = ({ id }) => {
  const navigate = useNavigate();

  return (
    <Dropdown className={`ml-auto px-3 ${styles.Absolute}`} drop="left">
      <Dropdown.Toggle as={ThreeDots} />
      <Dropdown.Menu>
        <Dropdown.Item
          onClick={() => navigate(`/profiles/${id}/edit`)}
          aria-label="edit-profile"
        >
          <i className="fas fa-edit" /> Edit Profile
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => navigate(`/profiles/${id}/edit/username`)}
          aria-label="edit-username"
        >
          <i className="far fa-id-card" /> Change Username
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => navigate(`/profiles/${id}/edit/password`)}
          aria-label="edit-password"
        >
          <i className="fas fa-key" /> Change Password
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default MoreDropdown;