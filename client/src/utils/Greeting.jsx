const Greeting = ({ name }) => {
    const getCurrentGreeting = () => {
      const currentHour = new Date().getHours();
      
      if (currentHour < 14 && currentHour > 6) {
        return 'Good Morning';
      } else if (currentHour < 18 && currentHour >= 14) {
        return 'Good Afternoon';
      } else {
        return 'Good Evening';
      }
    };
  
    return (
      <div>
        <h3 className="font-medium">{getCurrentGreeting()}, {name}</h3>
      </div>
    );
};

export default Greeting;