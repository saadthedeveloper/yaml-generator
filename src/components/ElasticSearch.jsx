import { useState } from 'react';

function ElasticSearch() {
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (event) => {

        if (event.target.checked) {
            setIsChecked(true);
        } else {
            setIsChecked(false);
        }
    };

    return (
        <div>
            <p>Do you want Elastic Search enabled?</p>
            <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
            <p style={{backgroundColor: "black", color: "white", padding: "10px"}}>
                global: <br />
                elasticsearch: <br />
                enabled: {isChecked ? "true" : "false"}
            </p>
        </div>
    )
}

export default ElasticSearch;