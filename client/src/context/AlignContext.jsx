import React, { createContext, useContext, useState, useEffect } from 'react';

const AlignContext = createContext(null);

const STORAGE_KEY = 'align_session_state_v1';

const defaultState = {
  userRequirement: null,
  eligibleSchemes: [],
  selectedSchemeIdsForComparison: [],
  calculatorState: {
    activeLoanAmount: 120000,
    activeTenureMonths: 36,
  },
  selectedScheme: null,
  selectedPartner: null,
  whatIfHistory: [],
};

export const AlignProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...defaultState, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to load session state:', e);
    }
    return defaultState;
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save session state:', e);
    }
  }, [state]);

  // Pre-populate schemes in background so all nav tabs are immediately functional
  useEffect(() => {
    if (!state.eligibleSchemes || state.eligibleSchemes.length === 0) {
      fetch('/api/schemes')
        .then((res) => res.json())
        .then((json) => {
          if (json.success && Array.isArray(json.data?.schemes) && json.data.schemes.length > 0) {
            setState((prev) => {
              if (prev.eligibleSchemes && prev.eligibleSchemes.length > 0) return prev;
              return {
                ...prev,
                eligibleSchemes: json.data.schemes,
                selectedSchemeIdsForComparison: prev.selectedSchemeIdsForComparison.length === 0
                  ? json.data.schemes.slice(0, 3).map((s) => s._id)
                  : prev.selectedSchemeIdsForComparison,
              };
            });
          }
        })
        .catch((err) => console.warn('Background scheme fetch failed:', err));
    }
  }, []);

  const setUserRequirement = (req) => {
    setState((prev) => ({
      ...prev,
      userRequirement: req,
      calculatorState: {
        ...prev.calculatorState,
        activeLoanAmount: req?.amount || prev.calculatorState.activeLoanAmount,
      },
    }));
  };

  const setEligibleSchemes = (schemes) => {
    setState((prev) => ({
      ...prev,
      eligibleSchemes: schemes,
      // Default select first 2 or 3 for comparison
      selectedSchemeIdsForComparison: schemes.slice(0, 3).map((s) => s.scheme?._id || s._id),
    }));
  };

  const setSelectedSchemeIdsForComparison = (ids) => {
    setState((prev) => ({
      ...prev,
      selectedSchemeIdsForComparison: ids,
    }));
  };

  const toggleSchemeComparison = (schemeId) => {
    setState((prev) => {
      const exists = prev.selectedSchemeIdsForComparison.includes(schemeId);
      let updated;
      if (exists) {
        updated = prev.selectedSchemeIdsForComparison.filter((id) => id !== schemeId);
      } else {
        if (prev.selectedSchemeIdsForComparison.length >= 3) {
          updated = [...prev.selectedSchemeIdsForComparison.slice(1), schemeId];
        } else {
          updated = [...prev.selectedSchemeIdsForComparison, schemeId];
        }
      }
      return { ...prev, selectedSchemeIdsForComparison: updated };
    });
  };

  const setCalculatorState = (calc) => {
    setState((prev) => ({
      ...prev,
      calculatorState: { ...prev.calculatorState, ...calc },
    }));
  };

  const setSelectedScheme = (scheme) => {
    setState((prev) => ({
      ...prev,
      selectedScheme: scheme,
    }));
  };

  const setSelectedPartner = (partner) => {
    setState((prev) => ({
      ...prev,
      selectedPartner: partner,
    }));
  };

  const addWhatIfScenario = (scenario) => {
    setState((prev) => ({
      ...prev,
      whatIfHistory: [...prev.whatIfHistory, { ...scenario, timestamp: new Date().toISOString() }],
    }));
  };

  const resetAll = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setState(defaultState);
  };

  return (
    <AlignContext.Provider
      value={{
        ...state,
        setUserRequirement,
        setEligibleSchemes,
        setSelectedSchemeIdsForComparison,
        toggleSchemeComparison,
        setCalculatorState,
        setSelectedScheme,
        setSelectedPartner,
        addWhatIfScenario,
        resetAll,
      }}
    >
      {children}
    </AlignContext.Provider>
  );
};

export const useAlign = () => {
  const context = useContext(AlignContext);
  if (!context) {
    throw new Error('useAlign must be used within an AlignProvider');
  }
  return context;
};
