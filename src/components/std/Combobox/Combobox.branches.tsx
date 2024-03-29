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
import {  useProjectStore } from "@/stores/project.store"
import { DialogCheckout, useDialogCheckoutStore } from "../Dialog/Dialog.checkout"
import { useMemo, useState } from "react"
import { invoke } from "@tauri-apps/api/tauri"
import { useQuery } from "@tanstack/react-query"
import { commitsStore } from "@/App"

export type Branch = {
    name: string
}

export const useGetBranchQuery = (path: string | undefined) => {
    return useQuery({
        queryKey: ['branches', path],
        queryFn: async () => {
            const result = await invoke<string>('greet', { path })
            let current = { name: '' }

            const branchs = result
                .split('\n')
                .map(line => {
                    if(line.startsWith("*")) {
                        current = { name: line.trim().replace("*", "") } 
                        return current
                    }
                    return { name: line.trim() } 
                })
                .filter((branch) => branch.name.length)
            return { current, branchs }
        }
    })
} 

export function ComboboxBranchs() {
    const [open, setOpen] = useState(false)
    const projectStore = useProjectStore()
    const changeCurrentBranch = useProjectStore(s => s.changeBrange)
    const checkout = useDialogCheckoutStore(s => s.setOpen)
    const error = commitsStore(s => s.error)
    const setError = commitsStore(s => s.setError)
    const [input, setInput] = useState<string>('')

    const { data } = useGetBranchQuery(projectStore.currentProject?.path)

    const filteredBranches = useMemo(() => {
        const result = data?.branchs.filter(branch => branch.name.includes(input))
        return !result?.length
                    ? [{name: input}]
                    : result
    }, [data, input])

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
                disabled={!projectStore.currentProject || !projectStore.currentProject.branches.length}
            >
                {data?.current.name || "Selecione uma branch"}
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
                            if(!projectStore.currentProject) return
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
                            className={cn( "mr-2 h-4 w-4", projectStore.currentProject?.currentBranch?.name === branch.name ? "opacity-100" : "opacity-0" )}
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
