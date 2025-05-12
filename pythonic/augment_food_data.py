import pandas as pd
import numpy as np
import random

def augment_food_data():
    """
    Load the Foods_data.csv file, shuffle and append the rows 20 times
    to increase the size of the dataset.
    """
    # Load the original dataset
    print("Loading food data from Foods_data.csv...")
    try:
        df = pd.read_csv('Foods_data.csv')
        print(f"Original dataset contains {len(df)} rows.")
        
        # Create a new dataframe to hold all the data
        augmented_df = df.copy()
        
        # Append shuffled copies of the original dataset 19 more times (total 20x)
        for i in range(19):
            # Shuffle the rows randomly
            shuffled_df = df.sample(frac=1).reset_index(drop=True)
            
            # Add a small amount of randomness to numeric columns if needed
            # This part is optional and can be modified based on your needs
            
            # Append the shuffled data
            augmented_df = pd.concat([augmented_df, shuffled_df], ignore_index=True)
            
            # Print progress
            if (i + 1) % 5 == 0:
                print(f"Added {i + 1} copies. Current size: {len(augmented_df)} rows.")
        
        # Save the augmented dataset
        output_file = 'Foods_data_augmented.csv'
        augmented_df.to_csv(output_file, index=False)
        
        print(f"\nAugmentation complete!")
        print(f"Original dataset: {len(df)} rows")
        print(f"Augmented dataset: {len(augmented_df)} rows")
        print(f"Saved to: {output_file}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    augment_food_data() 