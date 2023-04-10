// import React, { useState } from 'react';
// import {
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Button,
//   IconButton,
//   Chip,
//   SelectChangeEvent,
// } from '@mui/material';
// import { FilterList, Clear, DisplaySettings } from '@mui/icons-material';

// type Filter = {
//   label: string;
//   value: string;
// };

// type FiltersProps = {
//   filters: Filter[];
//   onChange: (selectedFilters: string[]) => void;
// };

// const Filters: React.FC<FiltersProps> = ({ filters, onChange }) => {
//   const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

//   const handleChange = (
//     event: SelectChangeEvent<string[]>,
//     child: React.ReactNode
//   ) => {
//     const selected = event.target.value as string[];
//     setSelectedFilters(selected);
//     onChange(selected);
//   };

//   const clearFilters = () => {
//     setSelectedFilters([]);
//     onChange([]);
//   };

//   return (
//     <div
//     style={{
//     display: "flex",
//     flexDirection: "column",
//     position: "absolute" as const,
//     top: "calc(100%)",
//     right: "auto",
//     left: "auto",
//     bottom: "auto",
//     backgroundColor: "#fff",
//     padding: "10px",
//     borderRadius: "30px",
//     boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
//     alignItems: "center",
//     zIndex: '999'
//       }}
//     >
//       <FormControl
//         style={{ margin: '8px', minWidth: '120px', maxWidth: '300px' , display: 'inline-table', inlineSize: 'max-content'}}
//       >
//         <InputLabel id="demo-mutiple-chip-label" style={{display:'contents'}}>Categories</InputLabel>
//         <Select  style={{display:'list-item'}}
//           labelId="demo-mutiple-chip-label"
//           id="demo-mutiple-chip"
//           multiple
//           value={selectedFilters}
//           onChange={handleChange}
//           inputProps={{
//             id: 'select-multiple-chip',
//           }}
//           renderValue={(selected) => (
//             <div
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 flexWrap: 'wrap',
//                 padding: '10px'
//               }}
//             >
//               {(selected as string[]).map((value) => (
//                 <Chip
//                   key={value}
//                   label={value}
//                   style={{ margin: '4px' }}
//                   color="primary"
//                 />
//               ))}
//             </div>
//           )}
//         >
//           {filters.map((filter) => (
//             <MenuItem key={filter.value} value={filter.value}>
//               {filter.label}
//             </MenuItem>
//           ))}
//         </Select>
//         <IconButton onClick={clearFilters}>
//         <Clear />
//       </IconButton>
//       </FormControl>
//       <Button variant="contained" color="primary">
//         Apply
//       </Button>
//       <IconButton onClick={clearFilters}>
//         <Clear />
//       </IconButton>
//       <IconButton>
//         <FilterList />
//       </IconButton>
//     </div>
//   );
// };

// export default Filters;

import React, { useState } from "react";

interface Props {
  data: { name: string; team: string }[];
  teamNames: string[];
}

const SearchFilterTable: React.FC<Props> = ({ data, teamNames }) => {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [checkedTeams, setCheckedTeams] = useState<string[]>([]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleTeamChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const teamName = event.target.name;
    if (event.target.checked) {
      setCheckedTeams([...checkedTeams, teamName]);
    } else {
      setCheckedTeams(checkedTeams.filter((name) => name !== teamName));
    }
  };

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (checkedTeams.length === 0 || checkedTeams.includes(item.team))
  );

  return (
    <>
      <div>
        <button onClick={() => setShowFilters(true)}>Filters</button>
        {/* table goes here */}
      </div>
      {showFilters && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(255, 255, 255, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: '999',
          }}
          onClick={() => setShowFilters(false)}
        >
          <div
            style={{
              background: "#fff",
              padding: "1rem",
              borderRadius: "8px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Filters</h2>
            <label htmlFor="search">Search by name:</label>
            <input
              id="search"
              type="text"
              value={search}
              onChange={handleSearchChange}
              style={{
                marginBottom: "1rem",
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
                width: "100%",
                boxSizing: "border-box",
              }}
            />
            <h3>Team:</h3>
            {teamNames.map((team) => (
              <div key={team}>
                <label>
                  <input
                    type="checkbox"
                    checked={checkedTeams.includes(team)}
                    onChange={handleTeamChange}
                    name={team}
                    style={{ marginBottom: "0.5rem" }}
                  />
                  {team}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default SearchFilterTable;

