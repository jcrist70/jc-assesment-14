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
    const pageId = params.location.pathname.split("/")[1];

    const [ weatherComponents, setWeatherComponents ] = useState([]);
    const [ showComponents, setShowComponents ] = useState([]);
    const [ locationComponents, setLocationComponents ] = useState([]);
    const [ buttonComponents, setButtonComponents ] = useState([]); 
    
    const [ components, setComponents ] = useState([]);
    const [ conditionComponents, setConditionComponents ] = useState([]);
    const [ variables, setVariables ] = useState([]);
    const [ lists, setLists ] = useState([]);
    
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
        ca: {name: "San Francisco",
            src: "/locations/san-francisco.png"},
        sf: {name: "San Francisco",
            src:  "/locations/san-francisco.png"}
    })

    useEffect(() => {
        getDataHandler(pageId);
    }, [pageId])

    useEffect(() => {
        setTimeout(() => {
            if (variables && variables.length !== 0) {
                let location = variables.find(el => el.name.includes('location'));
                if (location) {
                    setLocation(location.initialValue);
                } else {
                    setLocation('ny');
                }
            } else {
                setLocation('ny');
            }
        }, 1000);
    }, [components, lists, variables])

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
                    showComponents.push(component);
                    setShowComponents(showComponents); 
                    setShowImage(variables[0].initialValue)
                } else if (component.options.variable === 'show_weather') {
                    showComponents.push(component);
                    setShowComponents(showComponents); 
                    setShowWeather(variables[0].initialValue)
                } else if (component.options.variable === 'location') {
                    locationComponents.push(component);
                    setLocationComponents(locationComponents);
                }   
                buttonComponents.push(component);  
                setButtonComponents(buttonComponents);
            } else if (component.type === 'condition') {
                storeConditionComponent(component);
            }
            getWeatherComponent(location);
            return 0;
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [components, variables, lists])

    const getDataHandler = async (id) => {
        const pageData = await getPageData(id);
        console.log('---> PAGE DATA',pageData)
        // const data = JSON.parse(JSON.stringify(await getPageData(id))).data.data;
        let data = null;
        if (pageData !== null) {
            data = JSON.parse(JSON.stringify(pageData)).data.data;
            await setComponents(data.components);
            await setVariables(data.variables);
            await setLists(data.lists);
        } else {
            // TBD: This reverting address should not remain hardcoded
            // we should add React Router or setup a .env with PORT
            window.location.replace('http://localhost:3001');
        }
        // TBD check for ERROR on returned data 
        
    }
    
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

    const storeConditionComponent = async (condition) => {
        const children = lists[`${condition.children}`];
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
            };
            setConditionComponents(conditionComponents);
        }
    }

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

    const getLocationImageComponent = () => {
        const locationName = locationNames[location] && locationNames[location].name;
        const src = locationNames[location] && locationNames[location].src;
        return (
            <div className="image-container">
                <img className="image" src={src} alt={locationName} />
            </div>)
    }

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
            // children array
        }  
    }
    const list = lists[0];
    return (
        <div>
            {list &&
            // lists.length > 0 && lists.map((list, index) => {
                // if (index === 0) {
                    /* eslint-disable array-callback-return */
                    
                    <div key={uuid()}>   
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
                // }
                /* eslint-enable array-callback-return */
                // return null;
            // })
            }   
        </div>
    )
}

export default HomePage;