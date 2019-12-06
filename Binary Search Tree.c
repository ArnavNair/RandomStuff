#include<stdio.h>
#include<stdlib.h>
#include<math.h>
#include<ctype.h>
#include<string.h>


//Declare a Node
struct Node{
	int data;
	struct Node* left;
	struct Node* right;
};

struct Node* root = NULL;
int key;


//Function to perform Inorder Traversal
void inorder(struct Node* root)
{
        if(root == NULL)
                return;

		inorder(root->left);
        printf("%d ", root->data);
        inorder(root->right);
}

//Funciton to insert a value into the BST
struct Node* insert(struct Node* temp)
{
        //Check if we've reached an empty Node
		if(temp == NULL)
        {
                temp = (struct Node*)malloc(sizeof(struct Node));
                temp->data = key;
				return temp;
        }

		//Compare the key value with temp's children
		if(temp->data > key)
                temp->left = insert(temp->left);
        else if(root->data < key)
                temp->right = insert(temp->right);

		return temp;
}

//Function to delete a value from the BST
struct Node* delete(struct Node* temp)
{
	struct Node* temp1 = (struct Node*)malloc(sizeof(struct Node));

	//Compare the key value to the root's children
	if(temp == NULL)
		return temp;
	else if(temp->data > key)
		temp->left = delete(temp->left);
	else if(temp->data < key)
		temp->right = delete(temp->right);
	//Node to be deleted has been found
	else
	{
		//Desired node has only a right child
		if(temp->left == NULL)
		{
			temp1 = temp->right;
			free(temp);
			temp = NULL;
			return temp1;
		}
		//Desired node has only a left child
		else if(temp->right == NULL)
		{
			temp1 = temp->left;
			free(temp);
			temp = NULL;
			return temp1;
		}
		//Desired node has both children
		temp1 = temp->left;
		while((temp1 != NULL) && (temp1->right != NULL))
			temp1 = temp1->right;
		temp->data = temp1->data;

		//If there was only 1 level in the sub-tree
		if(temp1 == temp->left)
			temp->left = NULL;
		free(temp1);
		temp1 = NULL;
		return temp;
	}
}



int main()
{
	int choice;

	while(1)
	{
		printf("MENU\n");
		printf("1. Insertion\n");
		printf("2. Deletion\n");
		printf("3. Inorder Traversal\n");
		printf("4. Exit\n");

		printf("Enter your choice:");
		scanf("%d",&choice);
		switch(choice)
		{
			case 1: printf("Enter the data to be inserted.\n");
					scanf("%d", &key);
					root = insert(root);
					break;

			case 2: printf("Enter the data to be deleted.\n");
					scanf("%d", &key);
					delete(root);
					break;

			case 3: inorder(root);
					printf("\n");
					break;

			case 4: return 0;
					break;

			default:printf("Invalid choice.\n");
		}
	}
	return 0;
}
