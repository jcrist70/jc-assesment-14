// LIB
import { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid';
// API
import { getPageData } from '../apis/page.api';
import { getWeatherData } from '../apis/weather.api';
// SVG
import CloudyIcon from '../icons/cloudy.svg';
import RainIcon from '../icons/rain.svg';
import ClearIcon from '../icons/clear-day.svg';
// ICON
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'; 
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';

const HomePage = (params) => {
    const pageId = params.location.pathname.split("/")[1];
    // LOCAL STORES
    const [ weatherComponents, setWeatherComponents ] = useState([]);
    const [ components, setComponents ] = useState([]);
    const [ variables, setVariables ] = useState([]);
    const [ lists, setLists ] = useState([]);
    // VARIABLES
    const [ showImage, setShowImage ] = useState('hide');
    const [ showWeather, setShowWeather ] = useState('show');
    const [ location, setLocation ] = useState(''); 
    /* eslint-disable no-unused-vars */
    const [ locationNames, setLocationNames ] = useState({ 
        /* eslint-enable no-unused-vars */
        ny: {name: "New York",
            src: "/locations/new-york.png"},
        ch: {name: "Chicago",
            src: "/locations/chicago.png"},
        il: {name: "Chicago",
            src: "/locations/chicago.png"},
        ca: {name: "San Francisco",
            src: "/locations/san-francisco.png"},
        sf: {name: "San Francisco",
            src:  "/locations/san-francisco.png"}
    })

    // I'm using this hook to load the page data from the 
    // server whent the page is frist accessed, one-time 
    // per id
    useEffect(() => {
        getDataHandler(pageId);
    }, [pageId])

    // I'm usign this hook to set the initial location 
    // and keep it updated
    useEffect(() => {
        setTimeout(() => {
            if (variables && variables.length !== 0) {
                let location = variables.find(el => el.name.includes('location'));
                if (location) {
                    setLocation(location.initialValue);
                } else {
                    const key = weatherComponents[0].loc.split(',')[1].toLowerCase();
                    setLocation(key);
                }
            } else {
                const key = weatherComponents[0] ? weatherComponents[0].loc.split(',')[1].toLowerCase() : null;
                setLocation(key);
            }
        }, 100);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [components, lists, variables])

    // I'm using this hook to build my component stores  and 
    // set variables from the components found in the page data 
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
                    setShowImage(variables[0].initialValue)
                } else if (component.options.variable === 'show_weather') {
                    setShowWeather(variables[0].initialValue)
                } 
            }
            getWeatherComponent(location);
            return 0;
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [components, variables, lists])

    // Get, parse and store page data from server
    const getDataHandler = async (id) => {
        // added a bit of complexity here to setup redirect
        const pageData = await getPageData(id);
        let data = null;
        if (pageData !== null) {
            data = JSON.parse(JSON.stringify(pageData)).data.data;
            // console.log('PAGE DATA:', data)
            await setComponents(data.components);
            await setVariables(data.variables);
            await setLists(data.lists);
        } else {
            // TBD: This reverting address should not remain hardcoded
            // we should add React Router or setup a .env with PORT
            window.location.replace('http://localhost:3000');
        }
        // TBD check for ERROR on returned data (i.e. type using zod, etc.)
    }
    
    // Build a nicely searchable array of weatherComponents
    const storeWeatherComponent = async (id,lon,lat) => {
        const weatherData = await (await getWeatherData(lon,lat)).data.data;
        const weatherObject =  {
            id,
            loc: weatherData.location,
            data: weatherData,
            lon,
            lat
        }
        const found = weatherComponents.find(el => el.id === id);
        if (!found) weatherComponents.push(weatherObject);
        setWeatherComponents(weatherComponents);
    }

    // Ueser interaction variable management
    const toggleShowImage = () => {
        if (showImage === "show") setShowImage("hide");
        if (showImage === "hide") setShowImage("show");
    }
    const toggleShowWeather = () => {
        if (showWeather === "show") setShowWeather("hide");
        if (showWeather === "hide") setShowWeather("show");
    }
    const selectLocation = (e) => {
        const selection = e.target.id;
        if (selection) setLocation(selection);
    }

    // Four functions for building the weather component
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
    const getWeatherComponent = (rootComponent) => {
        let selectedComponent = null;
        if (rootComponent.options !== undefined) {
            const lon = rootComponent.options.lon;
            const lat = rootComponent.options.lat;
            selectedComponent = weatherComponents.find(el => el.lat === lat && el.lon === lon);  
        } else {
            selectedComponent = weatherComponents.find(el => el.loc.includes(location));
        }
        if (!selectedComponent) selectedComponent = weatherComponents[0];
          
        if (selectedComponent) {
            return (
            <div className="weather-container" key={uuid()}>
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

    // Build the location image component
    const getLocationImageComponent = () => {
        const locationName = locationNames[location] && locationNames[location].name;
        const src = locationNames[location] && locationNames[location].src;
        return (
            <div className="image-container">
                <img className="image" src={src} alt={locationName} />
            </div>)
    }

    // Build the two (show/hide) button comonents
    const getShowButtonComponent = (value, variable) => {
        if (value === "show") {
            return (
                <div className="button-component-container"> 
                    <div className="button-component" onClick={(variable === 'show_image' && toggleShowImage) || (variable === 'show_weather' && toggleShowWeather)}>
                        <div className="button-component-text" onClick={(variable === 'show_image' && toggleShowImage) || (variable === 'show_weather' && toggleShowWeather)}>Hide</div> 
                        <VisibilityOffOutlinedIcon className="button-component-icon" onClick={(variable === 'show_image' && toggleShowImage) || (variable === 'show_weather' && toggleShowWeather)} />
                    </div>
                </div>
            )
        } else if (value === "hide") {
            return (
                <div className="button-component-container"> 
                    <div className="button-component" onClick={(variable === 'show_image' && toggleShowImage) || (variable === 'show_weather' && toggleShowWeather)}>
                        <div className="button-component-text" onClick={(variable === 'show_image' && toggleShowImage) || (variable === 'show_weather' && toggleShowWeather)}>Show</div> 
                        <VisibilityOutlinedIcon className="button-component-icon" onClick={(variable === 'show_image' && toggleShowImage) || (variable === 'show_weather' && toggleShowWeather)} />
                    </div>
                    {variable === 'show_image' && getLocationImageComponent()}
                </div>
            )
        }  
    }

    // Passed a comonentId, return the JSX component built
    // from the data in the corresponding component store 
    const getComponentById = (componentId) => {
        // Search our array of components, parsed from page data,
        // and return a match with componentId
        const rootComponent = components.findLast(obj => {
            return obj.id === componentId;
        })
        if (rootComponent === undefined) {
            return <h3>rootComponent with id {componentId} not found</h3>
        }
        // Return JSX representing the requested component type taking 
        // into consideration the variable and value
        if (rootComponent.type && !rootComponent.children) {
            if (rootComponent.type === 'button' && rootComponent.options.variable === 'show_weather' && rootComponent.options.value === 'show' && showWeather === 'show') {
                    return getShowButtonComponent(rootComponent.options.value, rootComponent.options.variable);
            } else if (rootComponent.type === 'button' && rootComponent.options.variable === 'show_weather' && rootComponent.options.value === 'hide' && showWeather === 'hide') {
                    return getShowButtonComponent(rootComponent.options.value, rootComponent.options.variable);
            } else if (rootComponent.type === 'button' && rootComponent.options.variable === 'show_image' && rootComponent.options.value === 'show' && showImage === 'show') {
                    return getShowButtonComponent(rootComponent.options.value, rootComponent.options.variable);
            } else if (rootComponent.type === 'button' && rootComponent.options.variable === 'show_image' && rootComponent.options.value === 'hide' && showImage === 'hide') {
                    return getShowButtonComponent(rootComponent.options.value, rootComponent.options.variable);
            } else if (rootComponent.type === 'button' && rootComponent.options.variable === 'location') {     
                    const location = rootComponent.options.value;
                    const locationName = locationNames[location] && locationNames[location].name;
                    return (
                        <div className="button-component-container">
                        <div className="button-component" style={{ marginBottom: '0px' }} key={uuid()} id={location} onClick={(e) => selectLocation(e)}>
                            <div id={location} className="button-component-text" onClick={(e) => selectLocation(e)}>{locationName}</div> 
                            <RoomOutlinedIcon id={location} className="button-component-icon" onClick={(e) => selectLocation(e)}/>
                        </div></div>)
            } else if (rootComponent.type === 'image') {
                    return (
                        <div className="image-container">
                            <img className="image" src={rootComponent.options.src} alt={rootComponent.options.src} />
                        </div>)
            } else if (rootComponent.type === 'weather') {
                    // Because the weather component can be hidden, 
                    // I check the show variable here
                    if (showWeather && showWeather === 'show') {
                        storeWeatherComponent(rootComponent.id, rootComponent.options.lon, rootComponent.options.lat)
                        return getWeatherComponent(rootComponent);
                    } else { return null; }     
             } else {
                // Handle case where we receive a component type 
                // or variable that we don't recognize
                if (!(rootComponent.type === 'button' && rootComponent.options.variable === 'show_weather') && !(rootComponent.type === 'button' && rootComponent.options.variable === 'show_image')) {
                    return <h3>rootComponent type or variable not found {rootComponent.id}:{rootComponent.type}</h3>
                }
            }       
        } else {
            // leave for case where rootComponent may have 
            // children array instead of child
        }  
    }

    // Render all components from the root list (lists[0])
    const list = lists[0];
    return (
        /* eslint-disable array-callback-return */
        <div>
            {list && <div>   
                {list.components.map((componentId) => {
                    const rootComponent = components.findLast(obj => {
                        return obj.id === componentId;
                    })
                    if (rootComponent.type === 'condition') {
                        const subList = lists[rootComponent.children].components;
                        if (location === rootComponent.options.value) {
                            return subList && subList.map((componentId) => {
                                return <div key={uuid()}>{getComponentById(componentId)}</div>
                            })
                        } else if (subList.length === 1) {
                            return (
                                <div key={uuid()}>
                                    <div>{getComponentById(subList[0])}</div>
                                </div>)
                        } 
                    } else {
                        return <div key={uuid()}>{getComponentById(componentId)}</div>
                    }
                })}          
            </div>
            }   
        </div>
    )
    /* eslint-enable array-callback-return */
}

export default HomePage;