import { create } from 'zustand'
import { Project } from '../components/std/Combobox/Combobox.projects'
import { invoke } from '@tauri-apps/api/tauri'
import { Branch } from '../components/std/Combobox/Combobox.branches'

interface ProjectStore {
    projects: Project[]
    currentProject: Project | null
    setCurrentProject: (project: Project) => void
    addProject: (project: Project) => void
    removeCurrentProject: (project: Project) => void
    alreadyExists: (project: Project) => boolean
    changeBrange: (project: Project, branch: Branch) => void
    updateBranchsOfCurrentProject: () => void
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
    projects: [] as Project[],
    currentProject: null,
    setCurrentProject: (project) => set({ currentProject: project }),
    



    changeBrange: async (project, branch) => {
        return set(() => ({ currentProject: { ...project, currentBranch: branch } }))
    },
    addProject: async (project) => {
        const branches = (await invoke<string>('greet', { path: project.path })).split('\n').map(line => ({name: line.trim()})).filter((branch) => branch.name.length)
        project.branches = branches
        const currentBranch = branches.find((branch) => branch.name.startsWith('*'))
        project.currentBranch = { name: currentBranch?.name || '' }
        return set((state) => {
            if(!state.projects.length) {
                return { projects: [project] , currentProject: project }
            }
            return { projects: [...state.projects, project] 
        }}
    )},
    removeCurrentProject: (project) => {
        window.location.reload()
        set((state) => ({
            projects: state.projects.filter((p) => p.path !== project.path),
            currentProject: state.currentProject?.path === project.path ? null : state.currentProject
        }))},

    updateBranchsOfCurrentProject: async () => {
        const branches = (await invoke<string>('greet', { path: get().currentProject?.path })).split('\n').map(line => ({name: line.trim()})).filter((branch) => branch.name.length)
        const currentBranch = branches.find((branch) => branch.name.startsWith('*')) || null
        return set((state) => state.currentProject 
            ? ({ currentProject: { ...state.currentProject, branches , currentBranch } })
            : {} )
    },

    alreadyExists: (project) => get().projects.some((p) => p.path === project.path)
}))

