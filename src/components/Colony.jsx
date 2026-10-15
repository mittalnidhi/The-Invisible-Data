import { useState } from 'react';
import peridata from '../data/peridata.json';
import ColonySymptoms from './ColonySymptoms';
import ColonySelectorDivided from './ColonySelectorDivided';
import ColonySelectorPill from './ColonySelectorPill';
import ColonySilhouette from './ColonySilhouette';
import { NavLink } from 'react-router-dom';
import AgeGraph from './AgeGraph';
import Ornament from './Ornament';
import HormoneGraph from './HormoneGraph';
import "../Colony.css";

const viewOptions = ['Intense', 'Less Frequent', 'High Frequency'];
const hormoneOptions = ['FSH', 'Testosterone', 'Estrogen', 'Progesterone'];

export default function Colony() {
  const [currentCategory, setCurrentCategory] = useState('');
  const [currentView, setCurrentView] = useState('');
  const [currentStage, setCurrentStage] = useState('');
  const [currentHormone, setCurrentHormone] = useState('');

  const clearFilters = () => {
    setCurrentCategory('');
    setCurrentView('');
    setCurrentStage('');
    setCurrentHormone('');
  };

  return (
    <div className="colony-main relative flex flex-col w-full z-30">
      <ColonyNavBar />
      <main className="colony-layout">
        <section className="colony-filter-panel">
          <div className="colony-filter-content">
            <div className="colony-heading-row">
              <h5 className="filter-header-main">Select a Symptom</h5>
              <Ornament />
            </div>
            <div className="colony-symptom-list">
              <ColonySymptoms
                peridata={peridata.symptoms.children}
                currentCategory={currentCategory}
                setCurrentCategory={setCurrentCategory}
              />
            </div>
            <h5 className="filter-header">View</h5>
            <div className="colony-view-options">
              <ColonySelectorDivided
                options={viewOptions}
                currentOption={currentView}
                setCurrentOption={setCurrentView}
              />
            </div>
            <div className="colony-stage-row">
              <h5 className="filter-header">Stage</h5>
              <div className="colony-stage-selector">
                <ColonySelectorPill
                  options={['Early', 'Late']}
                  currentOption={currentStage}
                  setCurrentOption={setCurrentStage}
                />
              </div>
            </div>
          </div>
        </section>

        
<section className="colony-silhouette-panel">
  <ColonySilhouette
    peridata={peridata.symptoms.children}
    currentCategory={currentCategory}
    currentView={currentView}
    currentStage={currentStage}
    currentHormone={currentHormone}
  />
</section>


        <section className="colony-charts-column">
          <div className="colony-chart-panel">
            <div className="colony-chart-content">
              <div className="colony-heading-row">
                <h5 className="filter-header-main">Hormones</h5>
                <Ornament />
              </div>
              <div className="colony-graph-container">
                <HormoneGraph
                  options={hormoneOptions}
                  currentOption={currentHormone}
                  setCurrentOption={setCurrentHormone}
                />
              </div>
              <div className="colony-hormone-options">
                <ColonySelectorDivided
                  options={hormoneOptions}
                  currentOption={currentHormone}
                  setCurrentOption={setCurrentHormone}
                />
              </div>
              <div className="colony-heading-row">
                <h5 className="filter-header-main">Age</h5>
                <Ornament />
              </div>
              <div className="colony-graph-container">
                <AgeGraph />
              </div>
            </div>
          </div>
          <div className="colony-clear-filters">
            <button type="button" className="clear-filter" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

function ColonyNavBar() {
  return (
    <div className="colony-navbar">
      <NavLink to="/" state={{ skipTitle: true, restartId: Date.now() }} className="colony-brand">
        INVISIBLE DATA
      </NavLink>
      <div className="colony-subnav">
        <NavLink to="/colony" className={({ isActive }) => isActive ? 'colony-subnav-link active' : 'colony-subnav-link'}>Symptom Atlas</NavLink>
        <NavLink to="/cluster" className={({ isActive }) => isActive ? 'colony-subnav-link active' : 'colony-subnav-link'}>Symptom Cluster</NavLink>
        <NavLink to="/experiences" className={({ isActive }) => isActive ? 'colony-subnav-link active' : 'colony-subnav-link'}>Slice of Life</NavLink>
      </div>
      <div className="colony-nav-links">
        <NavLink to="/about">ABOUT</NavLink>
        <NavLink to="/path" className={({ isActive }) => isActive ? 'colony-path-link active' : 'colony-path-link'}>PATH</NavLink>
        <NavLink to="/dear-peri">DEAR PERI</NavLink>
      </div>
    </div>
  );
}
