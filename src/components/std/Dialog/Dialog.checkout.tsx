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
import { useEffect, useState } from "react"
import { create } from "zustand"
import { useProjectStore } from "@/stores/project.store"
import { Branch } from "../Combobox/Combobox.branches"
import { invoke } from "@tauri-apps/api/tauri"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal, LoaderIcon } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

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
    const promiseResolver = useDialogCheckoutStore(s => s.promiseResolver)
    const currentProject = useProjectStore(s => s.currentProject)
    const branchTarget = useDialogCheckoutStore(s => s.branchTarget)
    const updateBranchs = useProjectStore(s => s.updateBranchsOfCurrentProject)
    const [loading, setLoading] = useState(false)
    const [ openAlert, setOpenAlert ] = useState("")
    const queryClient = useQueryClient()
    const [checkoutStates, setCheckoutStates] = useState({
        pull: true,
        path: currentProject?.path || '',
        target: branchTarget?.name || '',
        new_branch: false
    })

    useEffect(() => {
        checkoutStates.new_branch && setCheckoutStates(prev => ({ ...prev, pull: false }))
    }, [checkoutStates.new_branch])


    async function handleExecCheckout() {
        if(!currentProject) return
        setLoading(true)
        invoke('checkout_branch', {
            path: currentProject.path,
            branch: branchTarget?.name ,
            pull: checkoutStates.pull,
            createBranch: checkoutStates.new_branch
        })
            .then(() => {
                queryClient.setQueryData<{current: Branch, branchs: Branch[]}>(['branches', currentProject.path], (state) => {
                    if(branchTarget && state) {
                        if(checkoutStates.new_branch) {
                            return  { current: { name : branchTarget.name }, branchs: [{ name : branchTarget.name } ,...state.branchs]  }
                        }
                        return {  ...state, current: { name : branchTarget.name } }
                    }
                })
                setCheckoutStates({
                    new_branch: false,
                    pull: true,
                    path: currentProject?.path || '',
                    target: branchTarget?.name || '',
                })
                setOpenAlert("")
                promiseResolver?.(true)
            })
            .catch((error) => {
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
                <b>{branchTarget?.name}</b>
            </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex items-center space-x-2 my-2 mt-5">
            <Switch id="airplane-mode" checked={checkoutStates.new_branch} onCheckedChange={(value)=> setCheckoutStates(prev => ({ ...prev, new_branch: value }))} />
            <Label htmlFor="airplane-mode" >Criar branch</Label>
        </div>
        <div className="flex items-center space-x-2 my-2">
            <Switch disabled={checkoutStates.new_branch} checked={checkoutStates.pull} onCheckedChange={(value)=> setCheckoutStates(prev => ({ ...prev, pull: value }))} id="airplane-mode"/>
            <Label htmlFor="airplane-mode">Fazer pull em seguida</Label>
        </div>
        {openAlert && !loading && <Alert variant="destructive" className="bg-transparent text-red-500">
            <Terminal className="h-4 w-4" />
            <AlertTitle >Deu ruim !</AlertTitle>
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
