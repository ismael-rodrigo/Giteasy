import * as React from "react"
import { Check, GitBranch, GitBranchPlus } from "lucide-react"
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
import { ScrollArea } from "@/components/ui/scroll-area"
export type Branch = {
    name: string
}

import {  useProjectStore } from "@/stores/project.store"
import { DialogCheckout, useDialogCheckoutStore } from "../Dialog/Dialog.checkout"

export function ComboboxBranchs() {
    const [open, setOpen] = React.useState(false)
    const branches = useProjectStore(s => s.currentProject?.branches || [])
    const currentBranch = useProjectStore(s => s.currentProject?.currentBranch)
    const currentProject = useProjectStore(s => s.currentProject)
    const changeCurrentBranch = useProjectStore(s => s.changeBrange)
    const checkout = useDialogCheckoutStore(s => s.setOpen)
    const [input, setInput] = React.useState<string>('')
    
    const filteredBranches= React.useMemo(() => {
        const result = branches.filter(branch => branch.name.includes(input))
        
        return !result.length
                    ? [{name: input}]
                    : result
    }, [branches, input])

    return (
        <div className="w-full">
        <Popover open={open} onOpenChange={(state)=>{
            setInput('')
            setOpen(state)
            }}>
            <PopoverTrigger asChild>
            <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between bg-opacity-15"
                disabled={!currentProject}
            >
                {currentBranch?.name || "Selecione uma branch"}
                <GitBranch className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[440px] ">
            <Command
                shouldFilter={false}
                onChange={(value) => {
                    //@ts-ignore
                    setInput(value.target?.value);
                }}
                className="w-full h-[260px]" >
                    <CommandInput className="w-full" />
                <CommandEmpty>
                </CommandEmpty>
                <ScrollArea className="h-[260px] overflow-y-auto">
                    <CommandGroup>
                    {filteredBranches.map((branch) => (
                        <CommandItem
                        key={branch.name}
                        onSelect={async (currentValue) => {
                            if(!currentProject) return
                            const checkouted = await checkout(true , { name: currentValue } )
                            if(checkouted)  {
                                const newProject = useProjectStore.getState().currentProject
                                newProject && !newProject.branches.some(s => s.name == currentValue) && (newProject.branches = [{ name: currentValue }, ...newProject?.branches])
                                if(!newProject) return
                                changeCurrentBranch(newProject , { name: currentValue })
                            }
                        }}
                        className="aria-selected:bg-violet-500 aria-selected:text-white data-[activated]:bg-slate-500 cursor-pointer"
                        >
                        <Check
                            className={cn( "mr-2 h-4 w-4", currentBranch?.name === branch.name ? "opacity-100" : "opacity-0" )}
                        />
                        {branch.name}
                        </CommandItem>
                    ))}
                    </CommandGroup>
                </ScrollArea>
            </Command>
            </PopoverContent>
            <DialogCheckout/>
        </Popover>
        </div>

  )
}