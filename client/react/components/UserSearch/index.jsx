import React from 'react';
import { Search } from 'semantic-ui-react';

import './styles.css';


const Search = ({
    value,
    results,
    onResultSelected,
    onSearchChange,
    isLoading,
    ...rest
}) => (
    <Search
        loading={isLoading}
        onResultSelect={onResultSelect}
        onSearchChange={onSearchChange}
        results={results}
        value={value}
        {...rest}
    />
);

export default Search;
