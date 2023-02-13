
// MUI ICON
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'; 
// COMPONENTS
import LocationImage from './locationImage.component';

const ShowButton = ({ value, variable, locationNames, location, toggleShowImage, toggleShowWeather }) => {
    if (value === "show") {
        return (
            <div className="button-component-container"> 
                <div className="button-component" onClick={(variable === 'show_image' && toggleShowImage) || (variable === 'show_weather' && toggleShowWeather)}>
                    <div className="button-component-text" onClick={(variable === 'show_image' && toggleShowImage) || (variable === 'show_weather' && toggleShowWeather)}>Hide</div> 
                    <VisibilityOffOutlinedIcon className="button-component-icon" onClick={(variable === 'show_image' && toggleShowImage) || (variable === 'show_weather' && toggleShowWeather)} />
                </div>
                {variable === 'show_image' && <LocationImage locationNames={locationNames} location={location}/>}
            </div>
        )
    } else if (value === "hide") {
        return (
            <div className="button-component-container"> 
                <div className="button-component" onClick={(variable === 'show_image' && toggleShowImage) || (variable === 'show_weather' && toggleShowWeather)}>
                    <div className="button-component-text" onClick={(variable === 'show_image' && toggleShowImage) || (variable === 'show_weather' && toggleShowWeather)}>Show</div> 
                    <VisibilityOutlinedIcon className="button-component-icon" onClick={(variable === 'show_image' && toggleShowImage) || (variable === 'show_weather' && toggleShowWeather)} />
                </div>
            </div>
        )
    }  
}

export default ShowButton;