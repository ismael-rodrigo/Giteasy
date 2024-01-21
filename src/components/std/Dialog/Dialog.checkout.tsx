import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,

  } from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { create } from "zustand"
import { useProjectStore } from "@/stores/project.store"
import { Branch } from "../Combobox/Combobox.branches"
import { invoke } from "@tauri-apps/api/tauri"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal, LoaderIcon } from "lucide-react"

<LoaderIcon className="animate-spin" />
interface DialogCheckoutState {
    open: boolean
    branchTarget: Branch | null
    setOpen: (open: boolean, branchTarget?: Branch) => Promise<boolean>
    promiseResolver: null | ((value: boolean) => void)
}
export const useDialogCheckoutStore = create<DialogCheckoutState>(set => ({
    open: false,
    promiseResolver: null,
    branchTarget: null,
    setOpen: async (open , branchTarget) => {
        set({open, branchTarget})
        const result = await new Promise<boolean>((resolve) => set({ promiseResolver: resolve }))     
        set({open: false , branchTarget: null})
        return result
    }
}))

export function DialogCheckout() {
    const open = useDialogCheckoutStore(s => s.open)
    const setOpen = useDialogCheckoutStore(s => s.setOpen)
    const promiseResolver = useDialogCheckoutStore(s => s.promiseResolver)
    const currentProject = useProjectStore(s => s.currentProject)
    const branchTarget = useDialogCheckoutStore(s => s.branchTarget)
    const [loading, setLoading] = useState(false)
    const [ openAlert, setOpenAlert ] = useState("")


    const [checkoutStates, setCheckoutStates] = useState({
        pull: true,
        path: currentProject?.path || '',
        target: branchTarget?.name || ''
    })


    async function handleExecCheckout() {
        if(!currentProject) return
        setLoading(true)
        invoke('checkout_branch', {
            path: currentProject.path,
            branch: branchTarget?.name.replace("*", "").trim() ,
            pull: checkoutStates.pull
        })
            .then((result) => {
                console.log(result)
                promiseResolver?.(true)
            })
            .catch((error) => {
                console.log(error)
                setOpenAlert(error)
            })
            .finally(() => {
                setTimeout(()=>{
                    setLoading(false)
                }, 1000)
            })

    }

return (

    <AlertDialog open={open} onOpenChange={state => !state && setOpenAlert("")}>
    <AlertDialogContent className="w-11/12 rounded" >
        <AlertDialogHeader>
            <AlertDialogTitle className="text-lg" >Checkout</AlertDialogTitle>
            <AlertDialogDescription className="text-center ">
                <p><b>{branchTarget?.name}</b></p> 
            </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex items-center space-x-2 my-2 mt-5">
            <Switch id="airplane-mode"/>
            <Label htmlFor="airplane-mode">Criar branch</Label>
        </div>
        <div className="flex items-center space-x-2 my-2">
            <Switch checked={checkoutStates.pull} onCheckedChange={(value)=> setCheckoutStates(prev => ({ ...prev, pull: value }))} id="airplane-mode"/>
            <Label htmlFor="airplane-mode">Fazer pull em seguida</Label>
        </div>
        {openAlert && <Alert variant="destructive" className="bg-transparent text-red-500">
            <Terminal className="h-4 w-4" />
            <AlertTitle >Não foi possível realizar o checkout !</AlertTitle>
            <AlertDescription>
                {openAlert}
            </AlertDescription>
        </Alert>}

        <AlertDialogFooter className="mt-5 flex flex-row items-center justify-between">
            <AlertDialogCancel className="m-0 w-1/3" onClick={()=>promiseResolver?.(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction className="hover:bg-violet-600 w-1/3" onClick={handleExecCheckout}>
                    {loading ? <LoaderIcon className="animate-spin" /> : "Continue" }
            </AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
    </AlertDialog>

)}
