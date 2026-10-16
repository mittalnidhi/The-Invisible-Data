import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import ClusterChart from './ClusterChart';
import ClusterSilhouette from './ClusterSilhouette';
import ClusterSymptoms from './ClusterSymptoms';
import '../Cluster.css';

export default function Cluster() {
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [currentNeighbors, setCurrentNeighbors] = useState([]);

  const chartProps = {
    currentSymptom,
    setCurrentSymptom,
    currentNeighbors,
    setCurrentNeighbors,
  };

  return (
    <div className="colony-main cluster-page relative flex flex-col min-h-screen w-full z-30">
      <div id="timeout-warning">Are you still there? Redirecting home in 10 seconds...</div>
      <ClusterNavBar />

      <main className="cluster-layout text-white">
        <section className="cluster-filter-panel gray-panel" aria-label="Select a symptom">
          <h5 className="filter-header cluster-filter-heading">Select a Symptom</h5>
          <div className="cluster-symptom-content">
            <ClusterSymptoms {...chartProps} />
          </div>
        </section>

        <section className="cluster-center-panel" aria-label="Symptom cluster visualization">
          <div className="cluster-chart-surface">
            <ClusterChart {...chartProps} />
          </div>
          <p className="cluster-caption">
            Perimenopause symptoms often occur in clusters rather than in isolation. This visualization reveals common patterns in how they are experienced together.
          </p>
        </section>

        <section className="cluster-right-column" aria-label="Symptom body visualization">
          <div className="cluster-body-panel gray-panel">
            <div className="cluster-body-inner">
              <ClusterSilhouette {...chartProps} />
            </div>
          </div>
          <div className="cluster-actions">
            <button className="clear-filter" onClick={() => setCurrentSymptom('')}>
              Reset Filters
            </button>
            <p className="hover-instruction">{'>>'} Hover over the dots to learn more</p>
          </div>
        </section>
      </main>
    </div>
  );
}

function ClusterNavBar() {
  return (
    <div className="colony-navbar">
      <NavLink to="/" state={{ skipTitle: true, restartId: Date.now() }} className="colony-brand">
        INVISIBLE DATA
      </NavLink>
      <div className="colony-subnav">
        <NavLink to="/colony" className="colony-subnav-link">Symptom Atlas</NavLink>
        <NavLink to="/cluster" className="colony-subnav-link active">Symptom Cluster</NavLink>
        <NavLink to="/experiences" className="colony-subnav-link">Slice of Life</NavLink>
      </div>
      <div className="colony-nav-links">
        <NavLink to="/about">ABOUT</NavLink>
        <NavLink to="/path" className="colony-path-link">PATH</NavLink>
        <NavLink to="/dear-peri">DEAR PERI</NavLink>
      </div>
    </div>
  );
}
