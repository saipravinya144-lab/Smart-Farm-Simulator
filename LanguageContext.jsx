import React, { createContext, useContext } from 'react'
import { translate, languageOptions } from '../utils/translations'

const LanguageContext = createContext()

export function LanguageProvider({ children, language, setLanguage }) {
  const t = (key, params = {}) => translate(language, key, params)

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languageOptions }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
