import { open } from '@tauri-apps/api/dialog';
import { Button } from "@/components/ui/button"; 
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Trash, FolderGit2, Github, Laptop2, FolderOpen  } from 'lucide-react';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs, 
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from '@/components/ui/checkbox';
import { Project } from '../Combobox/Combobox.projects';
import { useState } from 'react';
import { useProjectStore } from '@/stores/project.store';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


export function NewProjectModal(  ) {
    const [project, setProject] = useState<Project>({
        initGit: false,
        name: '',
        path: '',
        type: 'local',
        branches: [],
        currentBranch: null
    })

    const [openModal, setOpen] = useState(false)
    const addProject = useProjectStore(s=> s.addProject)
    const alreadyExists = useProjectStore(s => s.alreadyExists)

    const changeProjectState = (key:keyof Project ,value: Project[keyof Project]) => setProject(prev => ({...prev, [key]: value}))

    function handleSubmmit() {
        if(alreadyExists(project)) {
            setProject(prev =>({...prev, path: ''}))
            alert('Projeto já existe')
            return
        }
        addProject(project)
        setOpen(false)
        setProject(prev =>({...prev, path: ''}))
    }

return (<div className='w-full'>
<Dialog open={openModal} onOpenChange={(isOpen)=>setOpen(isOpen) }>
<DialogTrigger asChild >
    <TooltipProvider delayDuration={200}>
        <Tooltip>
            <TooltipTrigger asChild>
            <Button
                onClick={()=>setOpen(true)}
                variant='default' 
                className='bg-violet-500 hover:bg-violet-600 w-full text-white flex justify-evenly' >
                <FolderGit2 /> 
                    Add
            </Button>
            </TooltipTrigger>
            <TooltipContent>
            <p>Adicionar novo projeto</p>
        </TooltipContent>
        </Tooltip>
    </TooltipProvider>

</DialogTrigger>
<DialogContent className="w-11/12 rounded">
  <DialogHeader>
    <DialogTitle>Novo Projeto</DialogTitle>
  </DialogHeader>

  <Tabs defaultValue="account">
    <TabsList className="grid w-full grid-cols-2 gap-2">
      <TabsTrigger onClick={()=>changeProjectState('type', 'local')} value="account" className=' gap-2 data-[state=active]:bg-violet-500 dark:data-[state=inactive]:bg-violet-100  data-[state=active]:text-white text-black '>
      <Laptop2 /> Projeto local</TabsTrigger>
      <TabsTrigger onClick={()=>changeProjectState('type', 'remote')} value="password" className=' gap-2 data-[state=active]:bg-violet-500  dark:data-[state=inactive]:bg-violet-100 data-[state=active]:text-white text-black'>
        <Github />
        Projeto no GitHub</TabsTrigger>
    </TabsList>
    <TabsContent value="account">
      <Card>
        <CardHeader>
          <CardTitle>Projeto Local</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-1">
            <Label htmlFor="username">Nome do Projeto</Label>
            <Input id="username" value={project.name} onChange={(e)=>changeProjectState('name', e.target.value)} placeholder="Meu Projeto React" />
          </div>
          <div className="space-y-1">
            {!project?.path 
              ? <Button size="default" variant="outline" className='gap-2' onClick={async ()=> {
                const result = await open({
                  multiple: false,
                  directory: true,
                })
                if(typeof result === 'string') {
                  changeProjectState('path',  result.toLowerCase() )
                }
              }} >
                <FolderOpen />
                Diretório do projeto</Button>
              : <>
                <Label htmlFor="username">Diretório</Label>
                <Card >
                  <CardContent className="text-xs p-2 flex gap-1 w-full justify-between">
                    <p className='m-0 p-1 overflow-ellipsis text-nowrap overflow-x-clip max-w-72'>{project.path}</p>
                    <Trash onClick={()=>changeProjectState('path', '')} size={23} className="p-1 hover:text-red-500 rounded cursor-pointer"  />
                  </CardContent>
                </Card>
              </>
            }
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms">Criar .git na raiz do projeto</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={()=>handleSubmmit()}
            className='w-full bg-violet-500 hover:bg-violet-600 mt-3' 
            disabled={!project.path || project.name.length < 5} 
            >Registrar</Button>
        </CardFooter>
      </Card>
    </TabsContent>
    <TabsContent value="password">
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Change your password here. After saving, you'll be logged out.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="current">Current password</Label>
            <Input id="current" type="password" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="new">New password</Label>
            <Input id="new" type="password" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save password</Button>
        </CardFooter>
      </Card>
    </TabsContent>
  </Tabs>
</DialogContent>
</Dialog>

</div>
)}
