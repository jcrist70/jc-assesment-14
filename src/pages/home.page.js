// LIB
import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
// API
import { getPageData } from '../apis/page.api';
import { getWeatherData } from '../apis/weather.api';
// COMPONENTS
import Image from '../coponents/image.component';
import Weather from '../coponents/weather.component';
import ShowButton from '../coponents/showButton.component';
import LocationSelect from '../coponents/locationSelect.component';

const HomePage = (params) => {
    const history = useHistory();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    const key = weatherComponents && weatherComponents[0].loc.split(',')[1].toLowerCase();
                    setLocation(key);
                }
            } else {
                const key = weatherComponents && weatherComponents[0] ? weatherComponents[0].loc.split(',')[1].toLowerCase() : null;
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
                    storeWeatherComponentData(id, lon, lat);
                }
            } else if (component.type === 'button' && variables.length > 0) {
                if (component.options.variable === 'show_image') {
                    setShowImage(variables[0].initialValue)
                } else if (component.options.variable === 'show_weather') {
                    setShowWeather(variables[0].initialValue)
                } 
            }
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
            history.push("/");
        }
        // TBD check for ERROR on returned data (i.e. type using zod, etc.)
    }
    
    // Build a nicely searchable array of weatherComponents
    const storeWeatherComponentData = async (id,lon,lat) => {
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
                return <ShowButton value={rootComponent.options.value} variable={rootComponent.options.variable} locationNames={locationNames} location={location} toggleShowImage={toggleShowImage} toggleShowWeather={toggleShowWeather} />
            } else if (rootComponent.type === 'button' && rootComponent.options.variable === 'show_weather' && rootComponent.options.value === 'hide' && showWeather === 'hide') {
                return <ShowButton value={rootComponent.options.value} variable={rootComponent.options.variable} locationNames={locationNames} location={location} toggleShowImage={toggleShowImage} toggleShowWeather={toggleShowWeather} />
            } else if (rootComponent.type === 'button' && rootComponent.options.variable === 'show_image' && rootComponent.options.value === 'show' && showImage === 'show') {
                return <ShowButton value={rootComponent.options.value} variable={rootComponent.options.variable} locationNames={locationNames} location={location} toggleShowImage={toggleShowImage} toggleShowWeather={toggleShowWeather} />
            } else if (rootComponent.type === 'button' && rootComponent.options.variable === 'show_image' && rootComponent.options.value === 'hide' && showImage === 'hide') {
                return <ShowButton value={rootComponent.options.value} variable={rootComponent.options.variable} locationNames={locationNames} location={location} toggleShowImage={toggleShowImage} toggleShowWeather={toggleShowWeather} />
            } else if (rootComponent.type === 'button' && rootComponent.options.variable === 'location') {     
                const location = rootComponent.options.value;
                const locationName = locationNames[location] && locationNames[location].name;
                return (
                    <LocationSelect 
                    locationName={locationName} 
                    location={location} 
                    selectLocation={selectLocation} />)
            } else if (rootComponent.type === 'image') {
                return <Image rootComponent={rootComponent}/>
            } else if (rootComponent.type === 'weather') {
                // Because the weather component can be hidden, 
                // I check the show variable here
                if (showWeather && showWeather === 'show') {
                    storeWeatherComponentData(rootComponent.id, rootComponent.options.lon, rootComponent.options.lat)
                    return (
                        <Weather 
                        rootComponent={rootComponent}
                        weatherComponents={weatherComponents} 
                        location={location}/>)
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
        <div id="home-page">
            {list && <div id="home-page-1">   
                {list.components.map((componentId) => {
                    const rootComponent = components.findLast(obj => {
                        return obj.id === componentId;
                    })
                    if (rootComponent.type === 'condition') {
                        const subList = lists[rootComponent.children].components;
                        if (location === rootComponent.options.value) {
                            return subList && subList.map((componentId) => {
                                return( 
                                    <div key={uuid()}>
                                        {getComponentById(componentId)}
                                    </div>)
                            })
                        } else if (subList.length === 1) {
                            return (
                                <div key={uuid()}>
                                    {getComponentById(subList[0])}
                                </div>)
                        } 
                    } else {
                        return (
                            <div key={uuid()}>
                                {getComponentById(componentId)}
                            </div>)
                    }
                })}          
            </div>}   
        </div>
    )
    /* eslint-enable array-callback-return */
}

export default HomePage;