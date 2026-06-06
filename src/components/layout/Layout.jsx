import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'
import MobileNav from './MobileNav'
import { useUIStore } from '../../store/uiStore'
import { motion } from 'framer-motion'

export default function Layout({ children, noSidebar = false, noFooter = false }) {
  const { sidebarOpen } = useUIStore()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        {!noSidebar && <Sidebar />}
        <motion.main
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex-1 min-w-0 pb-20 lg:pb-0"
        >
          {children}
        </motion.main>
      </div>
      {!noFooter && <Footer />}
      <MobileNav />
    </div>
  )
}
