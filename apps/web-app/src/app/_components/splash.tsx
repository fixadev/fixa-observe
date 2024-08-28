
'use client'
import React, { useState } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SignUpDialog } from './dialogue';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

const ConceptInputPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <div className="w-1/2 flex flex-col items-center justify-center -mt-3 gap-6">
        <h1 className="text-5xl font-md mb-8">Bring any concept to life</h1>
            <div className="w-full flex flex-row gap-2">
            <Input 
            type="text" 
            placeholder="Explain how matrices work" 
            className="w-full text-xl bg-gray-800 text-white border-none rounded-lg py-7 px-6"
            />
            <SignUpDialog />
            </div>
        </div>
        
    </div>
  );
};

export default ConceptInputPage;