// LIB
import { v4 as uuid } from 'uuid';
// MUI ICON
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';

const LocationSelect = ({ locationName, location, selectLocation }) => {
    return (
        <div className="button-component-container">
        <div className="button-component" style={{ marginBottom: '0px' }} key={uuid()} id={location} onClick={(e) => selectLocation(e)}>
            <div id={location} className="button-component-text" onClick={(e) => selectLocation(e)}>{locationName}</div> 
            <RoomOutlinedIcon id={location} className="button-component-icon" onClick={(e) => selectLocation(e)}/>
        </div></div>)
}

export default LocationSelect;