

const LocationImage = ({ locationNames, location }) => {
    const locationName = locationNames[location] && locationNames[location].name;
    const src = locationNames[location] && locationNames[location].src;
    return (
        <div className="image-container">
            <img className="image" src={src} alt={locationName} />
        </div>)
}

export default LocationImage;