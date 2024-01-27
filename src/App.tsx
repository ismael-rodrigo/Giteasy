import { Separator } from "@/components/ui/separator"
import { ComboboxBranchs } from './components/std/Combobox/Combobox.branches';
import { ComboboxProjects } from './components/std/Combobox/Combobox.projects';
import { NewProjectModal } from "./components/std/new-project/NewProject";
import { ModeToggle } from "./components/std/theme-toggle/button";
import { useEffect } from "react";
import { useProjectStore } from "./stores/project.store";
import { Button } from "./components/ui/button";
import { CornerDownRight, DatabaseZap, GitCommitVertical } from "lucide-react";
import { Card } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { create } from "zustand";


interface CommitStore {
  commits: string[]
  error: string | null
  setError: (error: any) => void
}

export const commitsStore = create<CommitStore>((set, get) => ({
  commits: ["ola"],
  error: null,
  setError: (error: any) => set({ error }),
}))




function App() {
  const projects = useProjectStore(s => s.projects)
  const currentProject = useProjectStore(s => s.currentProject)

  const commitsError = commitsStore(s => s.error)

  useEffect(() => {
    const storedProjects = localStorage.getItem('projects')
    if(storedProjects) {
      useProjectStore.setState({ projects: JSON.parse(storedProjects) })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects))
  }, [projects , currentProject])


  return (<div className='h-[600px] bg-background opacity-85'>
    <div className="flex justify-end   items-center gap-2 px-5 py-2">
      
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
      <div className='px-5 mt-3 '>
        <p className='dark:text-white py-2'>Branch Atual</p>
        <ComboboxBranchs />
      </div>
      <Card  className={`bg-transparent mt-3 mx-5 border-2 h-72 ${commitsError && 'animate-shake border-red-700'}`}>
        <div className="flex">
            <Input className="w-full border-0 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" placeholder="Mensagem do commit" />
          <Button className="rounded-none rounded-tr hover:bg-violet-600">
            <GitCommitVertical />
            Commit
          </Button>
        </div>
            <Separator />
      </Card>
      <div className="flex justify-between">
        <div className="flex mt-2 ml-10 gap-2">
          <CornerDownRight className="mt-2"/>
          <Button variant="outline" className="mt-1 flex items-center gap-2  border">
            <DatabaseZap />
              Stash
          </Button>
        </div>
        <div className="mr-5 mt-4">
          <ModeToggle/>
        </div>
      </div>

  </div>

  )
}

export default App;
