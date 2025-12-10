import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

export default function LandingPage() {
    const [gems, setGems] = useState([]);
    const [filters, setFilters] = useState({ color: '', origin: '', minPrice: '', maxPrice: '' });

    const fetchGems = async () => {
        try {
            const { data } = await api.get('/inventory', { params: filters });
            setGems(data);
        } catch (error) {
            console.error('Failed to fetch gems', error);
        }
    };

    useEffect(() => {
        fetchGems();
    }, []);

    return (
        <div className="landing-page">
            <header className="landing-header">
                <div className="logo">💎 Gems Portal</div>
                <nav>
                    <Link to="/login" className="btn-secondary">Login</Link>
                    <Link to="/register" className="btn-primary">Register</Link>
                </nav>
            </header>

            <div className="hero-section">
                <h1>Exquisite Gems Collection</h1>
                <p>Discover our curated inventory of high-value gemstones.</p>

                <div className="filters landing-filters">
                    <input placeholder="Color" onChange={e => setFilters({ ...filters, color: e.target.value })} />
                    <input placeholder="Origin" onChange={e => setFilters({ ...filters, origin: e.target.value })} />
                    <button onClick={fetchGems} className="btn-primary">Search Collection</button>
                </div>
            </div>

            <div className="inventory-grid">
                {gems.map(gem => (
                    <div key={gem.id} className="gem-card">
                        <div className="gem-icon">💎</div>
                        <h3>{gem.name}</h3>
                        <div className="gem-details">
                            <p><span>Weight:</span> {gem.carat_weight}ct</p>
                            <p><span>Color:</span> {gem.color}</p>
                            <p><span>Origin:</span> {gem.origin}</p>
                            <p><span>Cert:</span> {gem.certification_id}</p>
                            <p className="price">${gem.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
