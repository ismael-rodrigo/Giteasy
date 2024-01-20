import * as React from "react"
import { Check, GitBranch } from "lucide-react"
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

import {  useProjectStore } from "@/components/stores/project.store"

export function ComboboxBranchs() {
    const [open, setOpen] = React.useState(false)
    const branches = useProjectStore(s => s.currentProject?.branches || [])
    const currentBranch = useProjectStore(s => s.currentProject?.currentBranch)
    const currentProject = useProjectStore(s => s.currentProject)
    const changeCurrentBranch = useProjectStore(s => s.changeBrange)


    return (
        <div className="w-full">
        <Popover open={open} onOpenChange={setOpen}   >
            <PopoverTrigger asChild>
            <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between bg-opacity-15"
            >
                {currentBranch?.name || "Selecione uma branch"}
                <GitBranch  className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[440px] ">
            <Command className="w-full " >
                <CommandInput className="w-full" />
                <CommandEmpty>Nenhuma branche encontrada.</CommandEmpty>
                <ScrollArea className="max-h-72">
                    <CommandGroup>
                    {branches.slice(0, 100).map((branch) => (
                        <CommandItem
                        key={branch.name}
                        onSelect={(currentValue) => {
                            currentProject && changeCurrentBranch(currentProject , { name: currentValue })
                            setOpen(false)
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
        </Popover>
        </div>

  )
}
