// "use client";

// import Link from "next/link";
// import { SidebarTrigger } from "~/components/ui/sidebar";
// import EvalGroupCard from "./_components/EvalGroupCard";
// import { useCallback, useMemo, useState, useEffect } from "react";
// import UnsavedChangesBar from "./_components/UnsavedChangesBar";
// import { api } from "~/trpc/react";
// import { Skeleton } from "~/components/ui/skeleton";
// import { type EvalSetWithIncludes } from "@repo/types/src/index";
// import { Button } from "~/components/ui/button";
// import { instantiateEvalGroup } from "~/lib/instantiate";

export default function EvalsPage() {
  return <div>EvalsPage</div>;
}

// export default function EvalsPage() {
//   const { data: _evalSets } = api.eval.getSets.useQuery();
//   const [evalSets, setEvalSets] = useState<EvalSetWithIncludes[]>();
//   const [originalEvalSets, setOriginalEvalSets] =
//     useState<EvalSetWithIncludes[]>();
//   useEffect(() => {
//     if (_evalSets) {
//       setEvalSets(_evalSets);
//       setOriginalEvalSets(_evalSets);
//     }
//   }, [_evalSets]);

//   const unsavedChanges = useMemo(() => {
//     return JSON.stringify(evalSets) !== JSON.stringify(originalEvalSets);
//   }, [evalSets, originalEvalSets]);

//   useEffect(() => {
//     const handleBeforeUnload = (e: BeforeUnloadEvent) => {
//       if (unsavedChanges) {
//         e.preventDefault();
//         e.returnValue = "";
//         return "";
//       }
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);

//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, [unsavedChanges, router]);

//   const createEvalSet = useCallback(() => {
//     setEvalSets((prev) => [
//       ...(prev ?? []),
//       { ...instantiateEvalGroup(), evals: [], conditions: [] },
//     ]);
//   }, []);

//   const { mutate: saveEvalSets, isPending: isSaving } =
//     api.eval.saveEvalSetsState.useMutation({
//       onSuccess: () => {
//         setOriginalEvalSets(evalSets);
//       },
//       onError: (e) => {
//         console.error("failed to save eval groups", e);
//         // toast({
//         //   title: "failed to save eval groups",
//         //   description: "please try again later",
//         // });
//       },
//     });
//   const handleSave = useCallback(async () => {
//     saveEvalGroups(evalGroups ?? []);
//   }, [evalGroups, saveEvalGroups]);

//   const handleDiscard = useCallback(() => {
//     console.log("discarding");
//     setEvalGroups(originalEvalGroups);
//   }, [originalEvalGroups]);

//   return (
//     <>
//       <div className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-background p-4">
//         <SidebarTrigger />
//         <Link href="/observe/evals">
//           <div className="font-medium">evaluation criteria</div>
//         </Link>
//       </div>
//       <div className="relative flex flex-1 flex-col gap-4 p-4 pb-96">
//         {!evalGroups ? (
//           <>
//             <Skeleton className="h-20 w-full" />
//             <Skeleton className="h-20 w-full" />
//             <Skeleton className="h-20 w-full" />
//           </>
//         ) : evalGroups.length === 0 ? (
//           <div className="container mx-auto flex h-full items-center justify-center p-4">
//             <div className="flex flex-col gap-4">
//               <div>
//                 <div className="text-lg font-medium">no eval groups.</div>
//                 <div className="text-sm text-muted-foreground">
//                   create an eval group to get started
//                 </div>
//               </div>
//               <Button
//                 className="flex shrink-0 items-center gap-2"
//                 onClick={createEvalGroup}
//               >
//                 create eval group
//               </Button>
//             </div>
//           </div>
//         ) : (
//           evalGroups.map((group) => (
//             <EvalGroupCard
//               key={group.id}
//               group={group}
//               onUpdate={(updated) => {
//                 setEvalGroups(
//                   evalGroups.map((g) => (g.id === updated.id ? updated : g)),
//                 );
//               }}
//             />
//           ))
//         )}
//       </div>
//       {unsavedChanges && (
//         <UnsavedChangesBar
//           save={handleSave}
//           discard={handleDiscard}
//           isSaving={isSaving}
//         />
//       )}
//     </>
//   );
// }

// // IDEA: create an default eval group when people first sign in
// // export type EvalGroup = {
// //   id: string;
// //   name: string;
// //   conditions: EvalCondition[];
// //   evals: Eval[];
// //   enabled: boolean;
// // };

// // export type Eval = {
// //   id: string;
// //   name: string;
// //   description: string;
// // };

// // const evalFilterCondition = z.object({
// //   id: z.string(),
// //   type: z.literal("filter"),
// //   property: z.string(),
// //   value: z.string(),
// // });

// // const evalTextCondition = z.object({
// //   id: z.string(),
// //   type: z.literal("text"),
// //   text: z.string(),
// // });

// // const evalConditionSchema = z.discriminatedUnion("type", [
// //   evalFilterCondition,
// //   evalTextCondition,
// // ]);

// // export type EvalCondition = z.infer<typeof evalConditionSchema>;

// // const testData: EvalGroup[] = [
// //   {
// //     id: "1",
// //     name: "test",
// //     conditions: [
// //       {
// //         id: "1",
// //         type: "text",
// //         text: "true",
// //       },
// //     ],
// //     evals: [
// //       {
// //         id: "c1",
// //         name: "placeholder text",
// //         description:
// //           "agent did not say any placeholder text, like 'customer_name' or the like",
// //       },
// //     ],
// //     enabled: true,
// //   },
// //   {
// //     id: "2",
// //     name: "test",
// //     conditions: [
// //       {
// //         id: "1",
// //         type: "filter",
// //         property: "customerId",
// //         value: "321fdsa69420",
// //       },
// //       {
// //         id: "2",
// //         type: "filter",
// //         property: "agentId",
// //         value: "42069asdf123",
// //       },
// //     ],
// //     evals: [
// //       {
// //         id: "c1",
// //         name: "correct questions",
// //         description:
// //           "check if agent asked the following questions:\n1. what is your name?\n2. what company do you work at?\n3. how many calls do you do per day?",
// //       },
// //     ],
// //     enabled: true,
// //   },
// //   {
// //     id: "3",
// //     name: "test",
// //     conditions: [
// //       {
// //         id: "1",
// //         type: "text",
// //         text: "agent tries to schedule a meeting",
// //       },
// //     ],
// //     evals: [
// //       {
// //         id: "c1",
// //         name: "ask for time zone",
// //         description: "agent asked the caller for what their time zone is",
// //       },
// //       {
// //         id: "c2",
// //         name: "ask for name",
// //         description: "agent asked the caller for their name",
// //       },
// //     ],
// //     enabled: true,
// //   },
// // ];
