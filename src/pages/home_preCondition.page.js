import { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid';

import { getPageData } from '../apis/page.api';
import { getWeatherData } from '../apis/weather.api';
import CloudyIcon from '../icons/cloudy.svg';
import RainIcon from '../icons/rain.svg';
import ClearIcon from '../icons/clear-day.svg';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'; 
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';

const HomePage = (params) => {
    // console.log(params.location.pathname)
    const id = params.location.pathname.split("/")[1];
    const [ components, setComponents ] = useState([]);
    const [ weatherComponents, setWeatherComponents ] = useState([]);
    const [ showComponents, setShowComponents ] = useState([]);
    const [ locationComponents, setLocationComponents ] = useState([]);
    const [ conditionComponents, setConditionComponents ] = useState([]);
    const [ lists, setLists ] = useState([]);
    const [ showImage, setShowImage ] = useState('show');
    const [ variables, setVariables ] = useState([]);
    const [ selectedLocation, setSelectedLocation ] = useState('');

    useEffect(() => {
        getDataHandler(id);
    }, [id])

    useEffect(() => {
        setTimeout(() => {
            setSelectedLocation('New York');
        }, 1000);
    }, [components])

    useEffect(() => {
        components.map((component) => {
            if (component.type === 'weather') {      
                const lon = component.options.lon;
                const lat = component.options.lat;
                const id = component.id;
                if (lon !== undefined && lat !== undefined) {
                    storeWeatherComponent(id, lon, lat);
                }
            } else if (component.type === 'button' && variables.length > 0) {
                if (component.options.variable === 'show_image') {
                    showComponents.push(component.options);
                    setShowComponents(showComponents); 
                    setShowImage(variables[0].initialValue)
                } else if (component.options.variable === 'location') {
                    locationComponents.push(component.options);
                    setLocationComponents(locationComponents);
                }     
            } else if (component.type === 'condition') {
                storeConditionComponent(component);
            }
            getWeatherComponent(selectedLocation);
            return 0;
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [components, variables, lists])

    const getDataHandler = async (id) => {
        const data = JSON.parse(JSON.stringify(await getPageData(id))).data.data;
        console.log(data, data.lists)
        await setComponents(data.components);
        await setVariables(data.variables);
        await setLists(data.lists);
    }
    
    const storeWeatherComponent = async (id,lon,lat) => {
        const weatherData = await (await getWeatherData(lon,lat)).data.data;
        const weatherObject =  {
            id,
            loc: weatherData.location,
            data: weatherData
        }
        const found = weatherComponents.find(el => el.id === id);
        if (!found) weatherComponents.push(weatherObject);
        setWeatherComponents(weatherComponents);
    }

    const storeConditionComponent = async (condition) => {
        const children = lists[`${condition.children}`];
        console.log('-------> storeConditionComponent condition:', condition, ', children:', children, ', lists:', lists)
        if (children !== undefined) {
            const conditionObject =  {
                conditionId: condition.id,
                listId: children.id,
                childrenComponents: children.components,
                variable: condition.options.variable,
                value: condition.options.value                
            }
            const found = conditionComponents.find(el => el.id === condition.id);
            if (!found) {
                conditionComponents.push(conditionObject);
                console.log('=====> conditionComponents:',conditionComponents)
                console.log('=====> components:',components)
            };
            
            setConditionComponents(conditionComponents);
        }
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

    const getUpcomingForcastDay = (index, upcomming) => {
        return <div className={`day-rt-${index+1}`}>{upcomming[index].day}</div>
    }

    const getWeatherComponent = (selectedLocation) => {
        let selectedComponent = weatherComponents.find(el => el.loc.includes(selectedLocation));
        if (!selectedComponent) selectedComponent = weatherComponents[0];
        if (selectedComponent) {
            return (<div className="weather-container" key={uuid()}>
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
        </div>)
        }
    }

    const toggleShowCity = () => {
        if (showImage === "show") setShowImage("hide");
        if (showImage === "hide") setShowImage("show");
    }

    const getShowButtonComponent = () => {
        if (showImage === "show") {
            return (
                <div className="button-component-container"> 
                    <div className="button-component" onClick={toggleShowCity}>
                        <div className="button-component-text" onClick={toggleShowCity}>Hide</div> 
                        <VisibilityOffOutlinedIcon className="button-component-icon" onClick={toggleShowCity} />
                    </div>
                </div>
            )
        } else if (showImage === "hide") {
            return (
                <div className="button-component-container"> 
                    <div className="button-component" onClick={toggleShowCity}>
                        <div className="button-component-text" onClick={toggleShowCity}>Show</div> 
                        <VisibilityOutlinedIcon className="button-component-icon" onClick={toggleShowCity} />
                    </div>
                </div>
            )
        }  
    }

    const getLocationSelectComponent = (component) => {
        return (
        <div className="button-component" style={{ marginBottom: '20px' }} key={uuid()} id={component.text} onClick={(e) => selectLocation(e)}>
            <div id={component.text} className="button-component-text" onClick={(e) => selectLocation(e)}>{component.text}</div> 
            <RoomOutlinedIcon id={component.text} className="button-component-icon" onClick={(e) => selectLocation(e)}/>
        </div>)
    }

    const selectLocation = (e) => {
        const selection = e.target.id;
        if (selection) setSelectedLocation(selection);
    }

    return (
        <div>
            {getShowButtonComponent()}
            {components.length > 0 && components.map((component) => {
                return (
                    <div key={component.id}>
                        {component.type === 'image' && showImage === "show" && component.options.alt.includes(selectedLocation) &&
                        <div className="image-container">
                            <img className="image" src={component.options.src} alt={component.options.alt} />
                        </div>}    
                    </div>
                )
            })}
            
            {getWeatherComponent(selectedLocation)}

            <div className="button-component-container">
                {locationComponents.length > 0 && locationComponents.map((component) => {
                    if (!component.text.includes(selectedLocation)) {
                        return getLocationSelectComponent(component);
                    } 
                })}
            </div>

        </div>
    )
}

export default HomePage;        