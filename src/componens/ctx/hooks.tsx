'use client';

import { db } from "@/firebase/config";
import { Allocation, Branch, Cluster, Completion, DesignRequest, DesignSize, DesignType, ProductionRequest, User } from "@/types";
import { collection, doc, getDocs, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "../AuthProvider";

// Hook to fetch all branches
export const useBranches = (): Branch[] => {
    const [branches, setBranches] = useState<Branch[]>([]);

    useEffect(() => {
        const colRef = collection(db, 'branches');
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const updated = snapshot.docs.map(
                (doc) => ({ id: doc.id, ...doc.data() } as Branch)
            );
            setBranches(updated);
        });

        return () => unsubscribe();
    }, []);

    return branches;
};

// Hook to fetch clusters of a specific branch
export const useClusters = ({ branchId }: { branchId: Branch['id'] }): Cluster[] => {
    const [clusters, setClusters] = useState<Cluster[]>([]);

    useEffect(() => {
        if (!branchId) return;

        const colRef = collection(db, 'branches', branchId, 'clusters');
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const updated = snapshot.docs.map(
                (doc) => ({ id: doc.id, ...doc.data() } as Cluster)
            );
            setClusters(updated);
        });

        return () => unsubscribe();
    }, [branchId]);

    return clusters;
};


export const useAllocations = (): Allocation[] => {
    const [allocations, setAllocations] = useState<Allocation[]>([]);
    useEffect(() => {
        const colRef = collection(db, 'allocations');
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const updated = snapshot.docs.map(
                (doc) => ({ ...doc.data() } as Allocation)
            );
            setAllocations(updated);
        });
        return () => unsubscribe();
    });

    return allocations;
}

type DesignReturn = {
    types: DesignType[],
    sizes: DesignSize[]
}
export const useDesignTypes = ({ id = undefined }: { id?: DesignType['id'] | undefined }): DesignReturn => {

    const [types, setTypes] = useState<DesignType[]>([]);
    const [sizes, setSizes] = useState<DesignSize[]>([]);

    useEffect(() => {
        const colRef = collection(db, 'design-types');
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const updated = snapshot.docs.map(
                (doc) => ({ id: doc.id, ...doc.data() } as DesignType)
            );
            setTypes(updated);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!id) return;
        const colRef = collection(db, 'design-types', id, 'sizes');
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const updated = snapshot.docs.map(
                (doc) => ({ ...doc.data() } as DesignSize)
            );
            setSizes(updated);
        });
        return () => unsubscribe();
    }, [id]);

    return { types, sizes }
}


type RequestType = 'design' | 'production';

type RequestProp<T extends RequestType> = {
    type: T;
};

// Overloads
export function useListRequestForAdmin(props: RequestProp<'design'>): { loading: boolean; designs: DesignRequest[] };
export function useListRequestForAdmin(props: RequestProp<'production'>): { loading: boolean; productions: ProductionRequest[] };
export function useListRequestForAdmin<T extends RequestType>({ type }: RequestProp<T>) {
    const { user } = useAuth();
    const [designs, setDesigns] = useState<DesignRequest[]>([]);
    const [productions, setProductions] = useState<ProductionRequest[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user?.id) return;
        setLoading(true);

        const unsubscribe = type === 'design'
            ? onSnapshot(
                query(
                    collection(db, "designs"),
                    where("executedBy", "==", user.id),
                    orderBy("createdAt", "desc")
                ),
                async (snapshot) => {
                    const list = await Promise.all(snapshot.docs.map(async (doc) => ({
                        id: doc.id,
                        ...doc.data(),
                        createdAt: doc.data().createdAt?.toDate(),
                        updatedAt: doc.data().updatedAt?.toDate(),
                    } as DesignRequest)));
                    setDesigns(list);
                    setLoading(false);
                }
            )
            : onSnapshot(
                query(
                    collection(db, "productions"),
                    where("executedBy", "==", user.id),
                    orderBy("createdAt", "desc")
                ),
                async (snapshot) => {
                    const list = await Promise.all(snapshot.docs.map(async (doc) => ({
                        id: doc.id,
                        ...doc.data(),
                        createdAt: doc.data().createdAt?.toDate(),
                        updatedAt: doc.data().updatedAt?.toDate(),
                    } as ProductionRequest)));
                    setProductions(list);
                    setLoading(false);
                }
            );

        return () => unsubscribe();
    }, [type, user?.id]);

    if (type === 'design') {
        return { loading, designs };
    } else {
        return { loading, productions };
    }
}

type Design = DesignRequest & {
    completions: Completion[];
}
export const useDesignRequest = (id: string | null) => {
    const [design, setDesign] = useState<Design | null>(null);

    useEffect(() => {
        if (!id) return;

        const designRef = doc(db, 'designs', id);
        const unsubscribe = onSnapshot(designRef, async (doc) => {
            const data = { id: doc.id, ...doc.data(), completions: [] } as unknown as Design;
            setDesign(data);

            const completionRef = collection(designRef, "completions");
            const queryCompletion = query(completionRef);
            const completions = (await getDocs(queryCompletion)).docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    image: formatImageUrl(data.image),
                    completedAt: data.completedAt?.toDate(),
                    updatedAt: data.updatedAt?.toDate(),
                } as Completion;
            });

            setDesign({ ...data, completions } as Design)
        });
        return () => unsubscribe();
    }, [id]);

    return design;
}


const formatImageUrl = (path?: string | null) => {
    return path ? (path.startsWith("http") || path.startsWith('data:image') ? path : '/storage/' + path) : null;
}
export const useUser = ({ id }: { id: string }) => {
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        if (!id) return;
        const docRef = doc(db, "users", id);
        const unsubscribe = onSnapshot(docRef, (doc) => {
            const data = { id: doc.id, ...doc.data() } as User;
            setUser({
                ...data,
                photo: formatImageUrl(data.photo)
            } as User);
        });
        return unsubscribe;
    }, [id]);

    return user;
}