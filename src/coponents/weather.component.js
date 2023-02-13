// LIB
import { v4 as uuid } from 'uuid';
// SVG
import CloudyIcon from '../icons/cloudy.svg';
import RainIcon from '../icons/rain.svg';
import ClearIcon from '../icons/clear-day.svg';

const Weather = ({ rootComponent, weatherComponents, location }) => {
    
    const getUpcomingForcastDay = (index, upcomming) => {
        return <div className={`day-rt-${index+1}`}>{upcomming[index].day}</div>
    }

    const getLargeForcastIcon = (conditionName) => {
        if (conditionName === 'Cloudy') {
            return <img className="icon-img" src={CloudyIcon} alt="Cloudy" />
        } else if (conditionName === 'Rain') {
            return <img className="icon-img" src={RainIcon} alt="Rain" />
        } else if (conditionName === 'Clear') {
            return <img className="icon-img" src={ClearIcon} alt="Clear-Day" />
        }
    }

    const getUpcomingForcastIcon = (index, upcomming) => {
        if (upcomming[index].conditionName === 'Cloudy') {
            return <img className={`icon-rt-${index+1}`} src={CloudyIcon} alt="Cloudy" />
        } else if (upcomming[index].conditionName === 'Rain') {
            return <img className={`icon-rt-${index+1}`} src={RainIcon} alt="Rain" />
        } else if (upcomming[index].conditionName === 'Clear') {
            return <img className={`icon-rt-${index+1}`} src={ClearIcon} alt="Clear-Day" />
        }
    }

    // Assemble the weather component 
        let selectedComponent = null;
        if (rootComponent.options !== undefined) {
            const lon = rootComponent.options.lon;
            const lat = rootComponent.options.lat;
            selectedComponent = weatherComponents.find(el => el.lat === lat && el.lon === lon);  
        } else {
            selectedComponent = weatherComponents.find(el => el.loc.includes(location));
        }
        if (!selectedComponent) selectedComponent = weatherComponents[0];
        
        const component = selectedComponent ? <div className="weather-container" key={uuid()}>
        <div className="weather">
            <div className="weather-grid">
                {getLargeForcastIcon(selectedComponent.data.conditionName)}
                <div className="temperature">{selectedComponent.data.temperature}&deg;{selectedComponent.data.unit.toUpperCase()}</div>
                <div className="forcast">{selectedComponent.data.conditionName}</div>
                <div className="location">{selectedComponent.data.location}</div>
                {getUpcomingForcastIcon(0,selectedComponent.data.upcomming)}
                {getUpcomingForcastIcon(1,selectedComponent.data.upcomming)}
                {getUpcomingForcastIcon(2,selectedComponent.data.upcomming)}
                {getUpcomingForcastDay(0,selectedComponent.data.upcomming)}
                {getUpcomingForcastDay(1,selectedComponent.data.upcomming)}
                {getUpcomingForcastDay(2,selectedComponent.data.upcomming)}
            </div>
        </div>
    </div> : null;

    return component;
}

export default Weather;