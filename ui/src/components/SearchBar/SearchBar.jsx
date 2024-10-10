import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { BsSearch } from 'react-icons/bs';

import styles from './SearchBar.module.scss';

const SearchBar = ({ placeholder = 'Search', onChange }) => {
  return (
    <InputGroup>
      <Form.Control
        placeholder={placeholder}
        onChange={({ target }) => {
          onChange(target.value);
        }}
      />
      <InputGroup.Text className={styles.icon}>
        <BsSearch />
      </InputGroup.Text>
    </InputGroup>
  );
};

export default SearchBar;
