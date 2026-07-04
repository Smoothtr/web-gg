import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import BrandHomePage from './views/BrandHomePage'
import V2Page from './V2Page'
import KoPage from './KoPage'
import IntroLoader from './components/IntroLoader'
import { PrivacyPage, TermsPage } from './views/LegalPage'
import AboutPage from './views/AboutPage'
import AboutBrandPage from './views/AboutBrandPage'
import TheOnePage from './views/TheOnePage'
import { PackagePage } from './views/PackagePage'
import { ContactPage, PackagesPage, ServicesPage } from './views/EntityUtilityPages'
import { InsightArticlePage, InsightsIndexPage } from './views/InsightsPage'
import { InternalLinkRouter } from './components/InternalLinkRouter'

export default function App() {
  return (
    <>
      <IntroLoader />
      <BrowserRouter>
        <InternalLinkRouter />
        <Routes>
          <Route path="/" element={<BrandHomePage lang="vi" />} />
          <Route path="/en" element={<BrandHomePage lang="en" />} />
          <Route path="/ko" element={<KoPage />} />
          <Route path="/vi" element={<V2Page />} />
          <Route path="/the-one" element={<TheOnePage lang="vi" />} />
          <Route path="/packages" element={<PackagesPage lang="vi" />} />
          <Route path="/insights" element={<InsightsIndexPage />} />
          <Route path="/insights/:slug" element={<InsightArticlePage />} />
          <Route path="/campaign/the-one" element={<Navigate to="/" replace />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/the-one-start" element={<PackagePage packageKey="consultant" lang="vi" />} />
          <Route path="/the-one-system" element={<PackagePage packageKey="agency" lang="vi" />} />
          <Route path="/the-one-scale" element={<PackagePage packageKey="partner" lang="vi" />} />
          <Route path="/the-one-consultant" element={<Navigate to="/the-one-start" replace />} />
          <Route path="/the-one-agency" element={<Navigate to="/the-one-system" replace />} />
          <Route path="/the-one-partner" element={<Navigate to="/the-one-scale" replace />} />
          <Route path="/en/the-one" element={<TheOnePage lang="en" />} />
          <Route path="/en/packages" element={<PackagesPage lang="en" />} />
          <Route path="/en/campaign/the-one" element={<Navigate to="/en" replace />} />
          <Route path="/en/the-one-start" element={<PackagePage packageKey="consultant" lang="en" />} />
          <Route path="/en/the-one-system" element={<PackagePage packageKey="agency" lang="en" />} />
          <Route path="/en/the-one-scale" element={<PackagePage packageKey="partner" lang="en" />} />
          <Route path="/en/the-one-consultant" element={<Navigate to="/en/the-one-start" replace />} />
          <Route path="/en/the-one-agency" element={<Navigate to="/en/the-one-system" replace />} />
          <Route path="/en/the-one-partner" element={<Navigate to="/en/the-one-scale" replace />} />
          <Route path="/en/about" element={<AboutBrandPage lang="en" />} />
          <Route path="/gioi-thieu" element={<AboutPage />} />
          <Route path="/about" element={<AboutBrandPage lang="vi" />} />
          <Route path="/chinh-sach-bao-mat" element={<PrivacyPage />} />
          <Route path="/dieu-khoan-dich-vu" element={<TermsPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}
