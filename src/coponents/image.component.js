
const Image = ({ rootComponent }) => {
    return (
        <div className="image-container">
            <img className="image" src={rootComponent.options.src} alt={rootComponent.options.src} />
        </div>)
}

export default Image;