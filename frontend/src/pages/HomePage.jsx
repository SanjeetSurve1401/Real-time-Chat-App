import { useThemeStore } from '../store/useThemeStore.js'

const HomePage = () => {
  const {theme, setTheme} = useThemeStore();  
  return (
    <div>HOME PAGE</div>
  )
}

export default HomePage