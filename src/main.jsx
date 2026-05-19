import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import './index.css';
import './Colony.css';
import './Cluster.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  
    <App />
  
);

(function() {

    const idleDurationSecs = 300;
    let idleTimeout;

    const resetIdleTimeout = function() {

        // Clears the existing timeout
        if(idleTimeout) clearTimeout(idleTimeout);

        // Set a new idle timeout to load the redirectUrl after idleDurationSecs
        idleTimeout = setTimeout(() => location.href = '/', idleDurationSecs * 1000);
    };

    // Init on page load
    resetIdleTimeout();

    // Reset the idle timeout on any of the events listed below
    ['click', 'touchstart', 'mousemove'].forEach(evt => 
        document.addEventListener(evt, resetIdleTimeout, false)
    );

})();

(function() {

    const idleDurationSecs = 290;
    let idleTimeout;

    const resetIdleTimeout = function() {

        // Clears the existing timeout
        if(idleTimeout){
            clearTimeout(idleTimeout);
            document.getElementById('timeout-warning').classList.remove('visible')
        };

        idleTimeout = setTimeout(() => document.getElementById('timeout-warning').classList.add('visible'), idleDurationSecs * 1000);
    };

    // Init on page load
    resetIdleTimeout();

    // Reset the idle timeout on any of the events listed below
    ['click', 'touchstart', 'mousemove'].forEach(evt => 
        document.addEventListener(evt, resetIdleTimeout, false)
    );

})();
