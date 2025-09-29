"use client";

import React from 'react';
import { leaderboardData } from '@/data/leaderboards';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const LeaderboardTable: React.FC = () => {
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Player</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Population</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboardData.map((entry, index) => (
            <TableRow key={entry.id} className={cn(index < 3 ? 'bg-yellow-50' : '')}>
              <TableCell className="font-bold text-lg">{entry.rank}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={entry.avatar} />
                    <AvatarFallback>{entry.playerName[0]}</AvatarFallback>
                  </Avatar>
                  <span>{entry.playerName}</span>
                </div>
              </TableCell>
              <TableCell className="font-medium">{entry.cityName}</TableCell>
              <TableCell>{entry.population.toLocaleString()}</TableCell>
              <TableCell>{entry.size}</TableCell>
              <TableCell className="font-bold">{entry.score.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaderboardTable;