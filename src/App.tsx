import { Separator } from "@/components/ui/separator"
import { ComboboxBranchs } from './components/std/Combobox/Combobox.branches';
import { ComboboxProjects } from './components/std/Combobox/Combobox.projects';
import { NewProjectModal } from "./components/std/new-project/NewProject";
import { ModeToggle } from "./components/std/theme-toggle/button";
import { useEffect } from "react";
import { useProjectStore } from "./stores/project.store";
import { Button } from "./components/ui/button";
import { FileCode } from "lucide-react";
import { invoke } from "@tauri-apps/api/tauri";

function App() {
  const projects = useProjectStore(s => s.projects)
  const currentProject = useProjectStore(s => s.currentProject)

  useEffect(() => {
    const storedProjects = localStorage.getItem('projects')
    if(storedProjects) {
      useProjectStore.setState({ projects: JSON.parse(storedProjects) })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects))
    console.log(`currentProject teste`, currentProject)
  }, [projects , currentProject])


  return (<div className='h-[600px] bg-background opacity-85'>
    <div className="flex justify-end   items-center gap-2 px-5 py-2">
      <p className='dark:text-white p-0 m-0'>Tema</p>
      <ModeToggle/>

    </div>
    <div className='flex gap-3 pb-5 px-5 justify-between align-middle'>
      <div> 
        <p className='dark:text-white mb-2'>Projeto Atual</p>
        <ComboboxProjects />
      </div>
      <div className="mt-8 w-full">
        <NewProjectModal />
      </div>
    </div>

    <Separator />
    <div className="flex justify-between px-5 gap-3 items-end">
      <div className='w-9/12  mt-3 '>
        <p className='dark:text-white py-2'>Branch Atual</p>
        <ComboboxBranchs />
      </div>

      <div className="w-3/12 ">
        <Button className="w-full hover:bg-violet-600 gap-1" onClick={()=> {
          invoke('open_folder_vs_code', { path: currentProject?.path })
        }}>
          <FileCode />
          VScode
        </Button>
      </div>
    </div>

  </div>

  )
}

export default App;
