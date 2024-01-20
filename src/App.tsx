import { open } from '@tauri-apps/api/dialog';
import { Button } from "./components/ui/button"; 
import { Separator } from "@/components/ui/separator"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Trash } from 'lucide-react';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from 'react';
import { Combobox } from './components/std/Combobox';
import { Checkbox } from './components/ui/checkbox';


function App() {

  const [directory, setDirectory] = useState<string | null>(null)

  return (<div className=''>
    <div className='flex justify-around gap-3 py-5 '>

      <Combobox />

      <Dialog modal={true}>
        <DialogTrigger asChild>
          <Button variant='default' className='bg-violet-500 hover:bg-violet-600 text-white' >Registrar Projeto</Button>
        </DialogTrigger>
        <DialogContent className="w-11/12 rounded">
          <DialogHeader>
            <DialogTitle>Novo Projeto</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="account">
            <TabsList className="grid w-full grid-cols-2 gap-2">
              <TabsTrigger value="account" className='bg-gray-200 data-[state=active]:bg-violet-500 data-[state=active]:text-white'>Projeto local</TabsTrigger>
              <TabsTrigger value="password" className='bg-gray-200 data-[state=active]:bg-violet-500 data-[state=active]:text-white'>Projeto no GitHub</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Projeto Local</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-1">
                    <Label htmlFor="username">Nome do Projeto</Label>
                    <Input id="username" placeholder="Meu Projeto React" />
                  </div>
                  <div className="space-y-1">
                    {!directory 
                      ? <Button size="default" variant="outline" onClick={async ()=> {
                        const result = await open({
                          multiple: false,
                          directory: true,
                        })
                        setDirectory(result as string)
                      }} >Diretório do projeto</Button>
                      : <>
                        <Label htmlFor="username">Diretório</Label>
                        <Card >
                          <CardContent className="text-xs p-2 flex gap-1 w-full justify-between">
                            <p className='m-0 p-1 overflow-ellipsis text-nowrap overflow-x-clip max-w-72'>{directory}</p>
                            <Trash onClick={()=>setDirectory(null)} size={22} className='hover:bg-gray-700 hover:text-white py-1 rounded cursor-pointer'  />
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
                  <Button className='w-full bg-violet-500 mt-3' disabled={!directory} >Registrar</Button>
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

    <Separator />
  </div>

  )
}

export default App;
