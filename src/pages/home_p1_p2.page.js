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
import { CommitOutlined } from '@mui/icons-material';

const HomePage = (params) => {
    // console.log(params.location.pathname)
    const pageId = params.location.pathname.split("/")[1];

    const [ weatherComponents, setWeatherComponents ] = useState([]);
    const [ showComponents, setShowComponents ] = useState([]);
    const [ locationComponents, setLocationComponents ] = useState([]);
    const [ buttonComponents, setButtonComponents ] = useState([]);
    
    
    
    const [ components, setComponents ] = useState([]);
    const [ conditionComponents, setConditionComponents ] = useState([]);
    const [ variables, setVariables ] = useState([]);
    const [ lists, setLists ] = useState([]);
    
    const [ showImage, setShowImage ] = useState('show');
    const [ location, setLocation ] = useState('');
    
    const [ locationNames, setLocationNames ] = useState({
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
        const data = JSON.parse(JSON.stringify(await getPageData(id))).data.data;
        console.log(data, data.lists)
        // check for ERROR on returned data 
        await setComponents(data.components);
        await setVariables(data.variables);
        await setLists(data.lists);
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
        // console.log('-------> storeConditionComponent condition:', condition, ', children:', children, ', lists:', lists)
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
                // console.log('=====> conditionComponents:',conditionComponents)
                // console.log('=====> components:',components)
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

    const getWeatherComponent_ORI = (location) => {
        let selectedComponent = weatherComponents.find(el => el.loc.includes(location));
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
    const getWeatherComponent = () => {
        const selectedComponent = weatherComponents[0];
        // console.log('============> selectedComponent:', selectedComponent)
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

    // const getShowButtonComponent = () => {
    //     if (showImage === "show") {
    //         return (
    //             <div className="button-component-container"> 
    //                 <div className="button-component" onClick={toggleShowCity}>
    //                     <div className="button-component-text" onClick={toggleShowCity}>Hide</div> 
    //                     <VisibilityOffOutlinedIcon className="button-component-icon" onClick={toggleShowCity} />
    //                 </div>
    //             </div>
    //         )
    //     } else if (showImage === "hide") {
    //         return (
    //             <div className="button-component-container"> 
    //                 <div className="button-component" onClick={toggleShowCity}>
    //                     <div className="button-component-text" onClick={toggleShowCity}>Show</div> 
    //                     <VisibilityOutlinedIcon className="button-component-icon" onClick={toggleShowCity} />
    //                 </div>
    //             </div>
    //         )
    //     }  
    // }
    const getShowButtonComponent = (value) => {
        if (value === "show") {
            return (
                <div className="button-component-container"> 
                    <div className="button-component" onClick={toggleShowCity}>
                        <div className="button-component-text" onClick={toggleShowCity}>Hide</div> 
                        <VisibilityOffOutlinedIcon className="button-component-icon" onClick={toggleShowCity} />
                    </div>
                </div>
            )
        } else if (value === "hide") {
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

    const getLocationSelectComponent_sORI = (component) => {
        return (
        <div className="button-component" style={{ marginBottom: '20px' }} key={uuid()} id={component.text} onClick={(e) => selectLocation(e)}>
            <div id={component.text} className="button-component-text" onClick={(e) => selectLocation(e)}>{component.text}</div> 
            <RoomOutlinedIcon id={component.text} className="button-component-icon" onClick={(e) => selectLocation(e)}/>
        </div>)
    }

    const selectLocation = (e) => {
        const selection = e.target.id;
        if (selection) setLocation(selection);
    }

    const renderCondition = (condition) => {
        // console.log('=====> condition:', condition)
        // console.log('=====> condition.childrenComponents[0]:', condition.childrenComponents[0])
        // console.log('=======> showComponents:', showComponents)
        
        let children = [];
        let index = 0;
        condition.childrenComponents.forEach((element) => {
            var result = components.filter(obj => {
                return obj.id === condition.childrenComponents[index]
            })
            if (result) children.push(result);
            index++;
        });
        // console.log('CONDITION => id : number of children : variable : value \n', condition.conditionId, ':', children.length, ':', condition.variable, ':', condition.value)
        let renderComponent = {};
        let renderThis = null;
        return (   
            children.map((component, index) => {
                // console.log('=======> component:', component)
                if (component[0].type === 'weather') {
                    renderComponent = weatherComponents.filter(obj => {
                        return obj.id === component[0].id;
                    })
                    // console.log('--------> weather renderComponent:', index, ', ', renderComponent)
                    renderThis = getWeatherComponent(renderComponent.loc);
                } else if (component[0].type === 'button') {
                    renderComponent = components.findLast(obj => {
                        return obj.id === component[0].id;
                    })
                    // console.log('--------> button renderComponent:', ', ', renderComponent)
                    if (renderComponent.options.value === 'show') {
                        renderThis = getShowButtonComponent('show');
                    } else if (renderComponent.options.value === 'hide') {
                        renderThis = getShowButtonComponent('hide');
                    }                      
                }
                
                return (
                    <div  key={uuid()}>
                        {renderThis}
                    </div>
                )
            })
        ) 
    }

    const getComponentById = (componentId) => {
        // console.log('----> componentId:', componentId)
        const rootComponent = components.findLast(obj => {
            return obj.id === componentId;
        })
        const renderComponentArr = lists.find(arr => {
            return arr.id === rootComponent.children;
        })
        // console.log('rootComponent ===> ', rootComponent)
        if (false) {
            return (
                <h2>{rootComponent.type}:{rootComponent.children}:{rootComponent.options.variable}:{rootComponent.options.value}::{renderComponentArr && JSON.stringify(renderComponentArr.components)}</h2>
            )
        }
        if (true) {
            if (rootComponent.type && !rootComponent.children) {
                if (rootComponent.type === 'button' && rootComponent.options.variable === 'show_weather' && rootComponent.options.value === 'show') {
                    return getShowButtonComponent(rootComponent.options.value);
                } else if (rootComponent.type === 'button' && rootComponent.options.variable === 'show_weather' && rootComponent.options.value === 'hide') {
                    return getShowButtonComponent(rootComponent.options.value);
                } else if (rootComponent.type === 'image') {
                    return (
                        <div className="image-container">
                            <img className="image" src={rootComponent.options.src} alt={rootComponent.options.src} />
                        </div>)
                } else if (rootComponent.type === 'weather') {
                    storeWeatherComponent(rootComponent.id, rootComponent.options.lon, rootComponent.options.lat)
                    return getWeatherComponent(); 
                } else {
                    return <h3>RENDERING COMPONENT ONLY FROM TYPE: {rootComponent.type}</h3>
                }
            } else if (rootComponent.type && rootComponent.children) {
                const renderComponentArr = lists.find(arr => {
                    return arr.id === rootComponent.children;
                })
                const selectedComponent = components.findLast(obj => {
                    return obj.id === renderComponentArr.components[0];
                })
                let renderThis = null;
                if (selectedComponent.type === 'weather') {
                    storeWeatherComponent(selectedComponent.id, selectedComponent.options.lon, selectedComponent.options.lat)
                    renderThis = getWeatherComponent(); 
                }
                return renderThis;
            }
        }
        

    }
    const getLocationSelectComponent = (location) => {
        const locationName = locationNames[location] && locationNames[location].name;
        return (
            <div className="button-component" style={{ marginBottom: '20px' }} key={uuid()} id={locationName} onClick={(e) => selectLocation(e)}>
                <div id={locationName} className="button-component-text" onClick={(e) => selectLocation(e)}>{locationName}</div> 
                <RoomOutlinedIcon id={locationName} className="button-component-icon" onClick={(e) => selectLocation(e)}/>
            </div>)
    }
    const getLocationImageComponent = (location) => {
        // console.log('------> location:', location)
        const locationName = locationNames[location] && locationNames[location].name;
        const src = locationNames[location] && locationNames[location].src;

        return (
            <div className="image-container">
                <img className="image" src={src} alt={locationName} />
            </div>)
    }

    return (
        <div>
            <h1>#LISTS: {lists.length}</h1>
            {lists.length > 0 && lists.map((list, index) => {
                
                if (index === 0) {
                    return <div key={uuid()}>
                        <h1>LIST[0]:</h1>
                        <h2>{JSON.stringify(list)}</h2>
                        <h1>COMPONENT LIST[0]:</h1>
                        <h3>{JSON.stringify(list.components)}</h3>
                        <h1>RENDERING COMPONENTS FROM LIST[0]:</h1>
                        {list.components.map((componentId) => {
                            console.log('=====> componentId:', componentId)
                            return <div key={uuid()}>{getComponentById(componentId)}</div>
                        })}
                        <h1>VARIABLES:</h1>
                        {variables && variables.map((variable) => {
                            return <div key={uuid()} className="info-component">{JSON.stringify(variable)}</div>
                        })}
                        <h1>LOCATION:</h1>
                        {location}<br/>
                        {getLocationSelectComponent(location)}<br/>
                        <h1>IMAGE</h1>
                        {getLocationImageComponent(location)}<br/>
                        

                    </div>
                }
                return null;
            })}   
        </div>
    )
}

export default HomePage;  


// return <h2 key={uuid()}>{JSON.stringify(list)}</h2>

// {conditionComponents && conditionComponents.map((condition) => {
//     return (
//     <div key={uuid()}>
//         {renderCondition(condition)}
//     </div>
//     )
// })}

// <div className="info-container"><div className="info-component">{JSON.stringify(condition)}</div></div>
                    

// <div className="info-container" style={{  backgroundColor: '#2ef0b9' }}><div className="info-component">{component[0].type}</div></div>
                        