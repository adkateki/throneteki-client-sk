export function achievementStatusLabel(achievement, userAchievement) {
    if(userAchievement.progress>=achievement.target) {
        return 'Completed';
    }

    return 'In Progress';
}

