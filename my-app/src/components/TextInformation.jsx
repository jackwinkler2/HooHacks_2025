import React, { useState } from 'react';
import './TextInformation.css';

const TextInformation = () => {
    const [cops, setCops] = useState(['']);
    const [suspects, setSuspects] = useState(['']);
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        objectiveOverview: ''
    });

    const handleCopChange = (index, value) => {
        const newCops = [...cops];
        newCops[index] = value;
        setCops(newCops);
    };

    const addCop = () => {
        setCops([...cops, '']);
    };

    const removeCop = (index) => {
        const newCops = cops.filter((_, i) => i !== index);
        setCops(newCops);
    };

    const handleSuspectChange = (index, value) => {
        const newSuspects = [...suspects];
        newSuspects[index] = value;
        setSuspects(newSuspects);
    };

    const addSuspect = () => {
        setSuspects([...suspects, '']);
    };

    const removeSuspect = (index) => {
        const newSuspects = suspects.filter((_, i) => i !== index);
        setSuspects(newSuspects);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log({
            ...formData,
            cops: cops.filter(cop => cop !== ''),
            suspects: suspects.filter(suspect => suspect !== '')
        });
    };

    return (
        <div className="text-information-container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="date">Date:</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="time">Time:</label>
                    <input
                        type="time"
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label>Cops:</label>
                    {cops.map((cop, index) => (
                        <div key={index} className="dynamic-input-group">
                            <input
                                type="text"
                                value={cop}
                                onChange={(e) => handleCopChange(index, e.target.value)}
                                placeholder={`Cop ${index + 1}`}
                            />
                            {cops.length > 1 && (
                                <button type="button" onClick={() => removeCop(index)}>
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={addCop}>
                        Add Cop
                    </button>
                </div>

                <div className="form-group">
                    <label>Suspects:</label>
                    {suspects.map((suspect, index) => (
                        <div key={index} className="dynamic-input-group">
                            <input
                                type="text"
                                value={suspect}
                                onChange={(e) => handleSuspectChange(index, e.target.value)}
                                placeholder={`Suspect ${index + 1}`}
                            />
                            {suspects.length > 1 && (
                                <button type="button" onClick={() => removeSuspect(index)}>
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={addSuspect}>
                        Add Suspect
                    </button>
                </div>

                <div className="form-group">
                    <label htmlFor="objectiveOverview">Objective Overview:</label>
                    <textarea
                        id="objectiveOverview"
                        name="objectiveOverview"
                        value={formData.objectiveOverview}
                        onChange={handleInputChange}
                        rows="4"
                        placeholder="Enter the objective overview..."
                    />
                </div>

                <button type="submit" className="submit-button">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default TextInformation;
