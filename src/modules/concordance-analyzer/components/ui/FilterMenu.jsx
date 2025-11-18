import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Menu latéral de filtrage des concordances
 * 
 * @param {Array} concordanceData - Données complètes
 * @param {Array} filteredData - Données filtrées
 * @param {Object} activeFilters - Filtres actifs
 * @param {Function} setActiveFilters - Setter des filtres
 * @param {Function} onClose - Fermer le menu
 */
const FilterMenu = ({ 
  concordanceData, 
  filteredData, 
  activeFilters, 
  setActiveFilters,
  onClose 
}) => {
  
  const { t } = useTranslation();
  
  // Extraire les valeurs uniques depuis concordanceData
  const availableAuthors = [...new Set(concordanceData.map(item => item.author).filter(a => a !== 'Anonyme'))].sort();
  const availableDomains = [...new Set(filteredData.map(item => item.domain).filter(d => d !== 'Domaine inconnu'))].sort();
  const availablePlaces = [...new Set(filteredData.map(item => item.place).filter(p => p !== 'Lieu inconnu'))].sort();
  const availablePeriods = [
    '1000-1099', '1100-1149', '1150-1199', '1200-1249', '1250-1299',
    'XIe siècle', 'XIIe siècle', 'XIIIe siècle', 'Période inconnue'
  ];

  // Toggle un filtre (ajouter ou retirer)
  const toggleFilter = (category, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(v => v !== value)
        : [...prev[category], value]
    }));
  };

  // Réinitialiser tous les filtres
  const clearAllFilters = () => {
    setActiveFilters({
      authors: [],
      domains: [],
      periods: [],
      places: [],
      searchTerm: ''
    });
  };

  // Compter le nombre total de filtres actifs
  const activeFilterCount = 
    activeFilters.authors.length +
    activeFilters.domains.length +
    activeFilters.periods.length +
    activeFilters.places.length +
    (activeFilters.searchTerm ? 1 : 0);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '400px',
      height: '100vh',
      background: 'linear-gradient(135deg, #1A365D 0%, #2C5282 100%)',
      color: '#F7FAFC',
      boxShadow: '-4px 0 20px rgba(0,0,0,0.3)',
      zIndex: 1000,
      overflowY: 'auto',
      padding: '2rem'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        borderBottom: '2px solid rgba(255,255,255,0.2)',
        paddingBottom: '1rem'
      }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '500',
          margin: 0
        }}>
          {t('concordance.filters.title')} {activeFilterCount > 0 && `(${activeFilterCount})`}
        </h2>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.3)',
            color: '#F7FAFC',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          ✕
        </button>
      </div>

      {/* Bouton Clear All */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearAllFilters}
          style={{
            width: '100%',
            background: 'rgba(239, 68, 68, 0.3)',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            color: '#F7FAFC',
            padding: '0.75rem',
            borderRadius: '6px',
            cursor: 'pointer',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}
        >
          ✕ {t('concordance.filters.resetAll')}
        </button>
      )}

      {/* Recherche textuelle */}
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '0.9rem', 
          marginBottom: '0.5rem',
          fontWeight: '500',
          opacity: 0.9
        }}>
          ⊞ {t('concordance.filters.textSearch')}
        </label>
        <input
          type="text"
          value={activeFilters.searchTerm}
          onChange={(e) => setActiveFilters(prev => ({...prev, searchTerm: e.target.value}))}
          placeholder={t('concordance.filters.searchPlaceholder')}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '6px',
            color: '#F7FAFC',
            fontSize: '0.9rem'
          }}
        />
      </div>

      {/* Section Auteurs */}
      <FilterSection
        title={`✒ ${t('concordance.filters.authors')}`}
        items={availableAuthors}
        activeItems={activeFilters.authors}
        onToggle={(value) => toggleFilter('authors', value)}
      />

      {/* Section Domaines */}
      <FilterSection
        title={`⚜ ${t('concordance.filters.domains')}`}
        items={availableDomains}
        activeItems={activeFilters.domains}
        onToggle={(value) => toggleFilter('domains', value)}
      />

      {/* Section Périodes */}
      <FilterSection
        title={`⧗ ${t('concordance.filters.periods')}`}
        items={availablePeriods}
        activeItems={activeFilters.periods}
        onToggle={(value) => toggleFilter('periods', value)}
      />

      {/* Section Lieux */}
      <FilterSection
        title={`✦ ${t('concordance.filters.places')}`}
        items={availablePlaces}
        activeItems={activeFilters.places}
        onToggle={(value) => toggleFilter('places', value)}
      />
    </div>
  );
};

/**
 * Section de filtres avec checkboxes
 * 
 * @param {string} title - Titre de la section
 * @param {Array} items - Liste des valeurs
 * @param {Array} activeItems - Valeurs actives
 * @param {Function} onToggle - Callback toggle
 */
const FilterSection = ({ title, items, activeItems, onToggle }) => {
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          marginBottom: '0.75rem',
          padding: '0.5rem',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '4px'
        }}
      >
        <h3 style={{ 
          fontSize: '1rem', 
          fontWeight: '500',
          margin: 0
        }}>
          {title} {activeItems.length > 0 && `(${activeItems.length})`}
        </h3>
        <span style={{ fontSize: '0.8rem' }}>
          {isExpanded ? '▼' : '▶'}
        </span>
      </div>

      {isExpanded && (
        <div style={{ 
          maxHeight: '200px', 
          overflowY: 'auto',
          paddingLeft: '0.5rem'
        }}>
          {items.map(item => (
            <label
              key={item}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
                padding: '0.25rem',
                borderRadius: '4px',
                background: activeItems.includes(item) ? 'rgba(255,255,255,0.1)' : 'transparent'
              }}
            >
              <input
                type="checkbox"
                checked={activeItems.includes(item)}
                onChange={() => onToggle(item)}
                style={{
                  marginRight: '0.5rem',
                  cursor: 'pointer'
                }}
              />
              <span style={{ 
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {item}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterMenu;
