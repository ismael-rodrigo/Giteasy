import * as React from "react"
import { Check, ChevronsUpDown, Trash } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {  useProjectStore } from "@/stores/project.store"
import { Branch } from "./Combobox.branches"

export type Project = {
    name: string
    path: string
    initGit: boolean
    type: 'local' | 'remote'
    branches: Branch[]
    currentBranch: Branch | null
}

export function ComboboxProjects() {
    const [open, setOpen] = React.useState(false)
    const projects = useProjectStore(s => s.projects)
    const currentProject = useProjectStore(s => s.currentProject)
    const setCurrentProject = useProjectStore(s => s.setCurrentProject)

    return (
        <div className="w-80">
        <Popover open={open} onOpenChange={setOpen}  >
            <PopoverTrigger asChild>
            <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between bg-opacity-15"
            >
                {currentProject?.name || "Selecione um Projeto"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
            <Command className="w-full">
                <CommandInput placeholder="" className="w-full" />
                <CommandEmpty>Nenhum Projeto enconotrado.</CommandEmpty>
                <CommandGroup>
                {projects.map((project) => (
                    <CommandItem
                        key={project.path}
                        onSelect={() => {
                            setCurrentProject(project)
                            setOpen(false)
                        }}
                        className="aria-selected:bg-violet-500 aria-selected:text-white cursor-pointer flex justify-between"
                    >
                    <div className="flex" >
                        <Check
                            className={cn(
                            "mr-2 h-4 w-4 col-span-1",
                            currentProject?.path === project.path ? "opacity-100" : "opacity-0"
                            )}
                        />
                        {project.name}
                    </div>
                    <Trash onClick={()=>{}} className="p-1 hover:text-red-500 rounded" size={23} />
                    </CommandItem>
                ))}
                </CommandGroup>
            </Command>
            </PopoverContent>
        </Popover>
        </div>
  )
}
